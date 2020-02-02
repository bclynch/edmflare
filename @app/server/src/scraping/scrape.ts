const CronJob = require('cron').CronJob;
import citiesArr from '../data/cities';
// not using import for hashid because wants to populate the salt which we never did
const Hashids = require('hashids');
const hashids = new Hashids();
import chalk from 'chalk';
import readline from 'readline';
import axios from 'axios';
import puppeteer, { Page } from 'puppeteer';
import createNestedArr from '../utils/createNestedArr';
import asyncForEach from '../utils/asyncForEach';
import sanitize from '../utils/sanitize';
import moment from 'moment';
import uploadImages from '../imgProcessing/imageProcessor';
import db from '../data/db';

export function initScrapeCronJob() {
  // setup job to fire every night to scrape 3am EST (7am UTC server time)
  const job = new CronJob('00 00 07 * * *', () => scrapeEvents());
  job.start();
  console.log(chalk.magenta('Scrape cron job inited'));
}

// objects of db tables
// arrays are what comes back from the db while the objects are used to check against for O(1) time complexity
// clear them out at the end (and beginning) of function to make sure these are cleared correctly
// add newly created elements as we add them to the db so these vars stay up to date and we don't need to make more expensive db calls
let dbVenueObj = {};
let dbEventObj = {};
let dbArtistObj = {};
let dbGenreObj = {};
let dbCitiesObj = {};
let dbScrapeErrors = {};
let successfulCitiesScraped = 0;

interface City {
  id: string;
  show: boolean;
  fullName: string;
  shortName: string;
}

interface Event {
  id: number;
  venue: string;
  name: string;
  artists: string[];
  description: string;
  type: string;
  startTime: number;
  endTime: number;
  ticketProviderId: number;
  ticketProviderUrl: string;
  banner: string;
  eventUrl: string;
}

interface Venue {
  name: string;
  description: string | null;
  lat: number | null;
  lon: number | null;
  city: string;
  address: string | null;
  photo: string | null;
}

interface Artist {
  name: string;
  bio: string;
  photo: string;
  twitterUsername: string;
  twitterUrl: string;
  facebookUsername: string;
  facebookUrl: string;
  instagramUsername: string;
  instagramUrl: string;
  soundcloudUsername: string;
  soundcloudUrl: string;
  youtubeUsername: string;
  youtubeUrl: string;
  spotifyUrl: string;
  homepage: string;
}

export function scrapeEvents() {
  console.time(chalk.cyan.bold('Total scrape time'));

  // clear master db objects from last time
  dbVenueObj = {};
  dbEventObj = {};
  dbArtistObj = {};
  dbGenreObj = {};
  dbCitiesObj = {};
  dbScrapeErrors = {};
  successfulCitiesScraped = 0;

  const scrapeCityPromise = (city: City) => {
    return new Promise((resolve) => {
      scrapeEventDetails(city).then((eventsDetails) => {
        console.log(chalk.magenta(`Successfully scraped ${eventsDetails.length} events`));
        // create unique id for each event
        const scrapedEvents: { id: string; }[] = eventsDetails.map((eventDetails: { id: any }) => (
          {
            ...eventDetails,
            id: hashids.encode(eventDetails.id)
          }
        ));
        fetchDBEvents().then(
          () => {
          compareIds(scrapedEvents).then(
            (newEvents: any) => {
              compareArtists(newEvents).then(
                () => {
                  checkEventbrite(newEvents).then(
                    (newEventsChecked: any) => {
                      compareVenues(newEventsChecked).then(
                        () => {
                          scrapeEventUrls(newEventsChecked).then(
                            (completeEvents) => {
                              createEvents(completeEvents).then(
                                () => {
                                  linkArtistToEvent(newEvents).then(
                                    () => {
                                      successfulCitiesScraped++;
                                      resolve();
                                    },
                                    err => errHandler(err, city, resolve)
                                  );
                                },
                                err => errHandler(err, city, resolve)
                              );
                            },
                            err => errHandler(err, city, resolve)
                          );
                        },
                        err => errHandler(err, city, resolve)
                      );
                    },
                    err => errHandler(err, city, resolve)
                  );
                },
                err => errHandler(err, city, resolve)
              );
            },
            err => errHandler(err, city, resolve)
          );
        },
        err => errHandler(err, city, resolve));
      });
    });
  }

  const errHandler = (err: any, city: any, resolve: any) => {
    console.log('ERR: ', chalk.red(err));
    console.log('ERR: ', chalk.red(JSON.stringify(err)));
    dbScrapeErrors[city] = err;
    resolve();
  };

  const mapSeries = async (iterable: any, action: any) => {

    // loop through cities using synchronous processing of scraping promise
    for (const [index, x] of iterable.entries()) {
      console.log(`Processing location ${index + 1} of ${iterable.length} - ${JSON.parse(x)[0].fullName}`);
      await action(x)
    }

    // send off an email of the info for the scrape
    const sql = `
    SELECT graphile_worker.add_job(
      'scrape_report',
      json_build_object(
        'dbErrors', '${JSON.stringify(dbScrapeErrors)}',
        'numberErrors', '${Object.keys(dbScrapeErrors).length}'
      )
    );
    `;

    db.query(sql, (err: any) => {
      if (err) console.log(err);
      console.log(chalk.blue.bold(`Successfully updated DB with ${successfulCitiesScraped} cities scraped and ${citiesArr.length - successfulCitiesScraped} errors`));
      console.timeEnd(chalk.cyan.bold('Total scrape time'));
    });
  }

  mapSeries(citiesArr, scrapeCityPromise);
}

let scrapeEventDetails = async (city: City) => {
  console.log(chalk.yellow('Scraping event details from edmtrain...'));

  const scrapeLoop = async () => {
    const scrapeData: any[] = [];
    // sequentially run through our array of cities via sequential async fns
    await asyncForEach([city], async(cities: any) => {
      // spin up puppeteer browser
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto('https://edmtrain.com', { timeout: 0 });

      // wait for page to get started then modify local storage with desired cities to scrape
      await page.waitFor(1000);
      await page.evaluate((cities) => {
        localStorage.setItem('locationArray', cities);
        localStorage.setItem('selectedPage', 'concerts');
      }, cities);

      // reload to fetch new data based on local storage
      await page.reload();

      // wait for results to load
      await page.waitForSelector('.filterIcon');

      const data = await page.evaluate(() => {

        let data = []; // Create an empty array that will store our data
        const events: any = document.querySelectorAll('.eventContainer');

        for (const event of events) {
          const id = +event.getAttribute('eventid');
          const artists = event.getAttribute('titlestr').split(',').map((artist: string) => {
            // if there is a colon it means there is some tour / show name prepending this thing and we are removing that from the artist name
            if (artist.indexOf(':') !== -1) return artist.split(':')[1].trim();
            return artist.trim();
          });
          // don't want the edm train default
          const artistImage = event.getAttribute('eventimg') !== 'img/artist/default.png?v=2' ? `https://edmtrain.s3.amazonaws.com/${event.getAttribute('eventimg')}` : null;
          const venueSelector: any = document.querySelector(`.eventContainer[eventid="${id}"] .eventLocation > span`);
          const venue = venueSelector.innerText;
          const eventUrl = document.querySelector(`.eventContainer[eventid="${id}"] .eventLink a`)!.getAttribute('href');
          const startTimeFigures = event.getAttribute('sorteddate').split('-');
          // subtract one from the months portion since it is zero index
          const startTime = new Date(+startTimeFigures[0], +startTimeFigures[1] - 1, +startTimeFigures[2]).getTime();

          data.push({ id, artists, artistImage, venue, eventUrl, startTime });
        }

        return data;
      });
      scrapeData.push(data);

      await browser.close();
      return scrapeData
    });
    return [].concat.apply([], scrapeData);
  }
  return await scrapeLoop();
};

function checkEventbrite(newEvents: any) {
  console.log(chalk.yellow('Checking event brite details...'));
  return new Promise((resolve) => {
    // not going to batch these and just go one by one synchronously in hopes it works better

    const abc = (event: { id: string; }) => {
      return new Promise((resolve) => {
        axios.get(`https://edmtrain.com/get-event-detail?id=${hashids.decode(event.id)}`).then(
          (resp) => {
            let object = JSON.parse(resp.data.data.eventDetailContent);
            if (object) {
              const { id, name: { text }, description: { html }, start, end, logo } = object;
              // if there's a change add the pertinent new data
              let moddedEvent = {
                ...event,
                ticketProviderId: id,
                name: text,
                description: html || null,
                startTime: new Date(start.local).getTime(),
                endTime: new Date(end.local).getTime(),
                banner: logo ? logo.original.url : null
              };
              resolve(moddedEvent);
            } else {
              // if no change just resolve the same event
              resolve(event);
            }
          },
          // err out, but just resolve so we can continue
          () => resolve(event)
        )
      });
    }

    const mapSeries = async (iterable: any, action: any) => {
      const processedEvents = [];
      const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

      // loop through batches using async sequentially so we give their server a break
      for (const [index, x] of iterable.entries()) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Processing eventbrite url ${index + 1} of ${iterable.length}`);
        await sleep(1000);
        processedEvents.push(await action(x));
      }
      return processedEvents;
    }

    const events = mapSeries(newEvents, abc);
    resolve(events);
  });
};

function compareIds(scrapedEvents: { id: string }[]) {
  console.log(chalk.yellow('Comparing scraped events versus existing...'));
  return new Promise((resolve) => {
    let newEvents: { id: string }[] = [];
    // Check scraped ids vs db ids to see which need to be added
    scrapedEvents.forEach((scrapedEvent) => {
      if (!dbEventObj[scrapedEvent.id]) {
        // doesn't exist so create event
        // pass scraped event obj into an arr and then send all sql in one call
        newEvents.push(scrapedEvent);
      }
    });
    console.log(chalk.yellow(`Processing ${newEvents.length} new events...`));
    resolve(newEvents);
  });
}

function compareVenues(newEvents: Event[]) {
  console.log(chalk.yellow('Comparing venues vs existing...'));
  return new Promise((resolve, reject) => {
    fetchDBVenues().then(
      () => {
        let newVenues: string[] = [];
        let newVenuesObj = {};
        // Check scraped ids vs db ids to see which need to be added
        newEvents.forEach((newEvent) => {
          if (newEvent) {
            const sanitizedVenue = sanitize(newEvent.venue);
            if (!dbVenueObj[sanitizedVenue] && !newVenuesObj[sanitizedVenue]) {
              // doesn't exist so create venue
              // pass scraped venue obj into an arr and then send all sql in one call
              newVenues.push(sanitizedVenue);
              // create prop on our new artist obj to check against
              // when they are actually added to db we will add to master obj
              newVenuesObj[sanitizedVenue] = {};
            }
          }
        });

        fetchVenueInformation(newVenues).then(
          (venues) => {
            fetchVenueImages(venues).then(
              (completedVenues) => {
                createVenues(completedVenues).then(
                  (msg: string) => {
                    console.log(chalk.green(msg));
                    resolve();
                  },
                  (err) => reject(err)
                );
              }
            )
          },
          (err) => reject(err)
        )
      }
    );
  });
}

function compareArtists(newEvents: any) {
  console.log(chalk.yellow('Starting to check artists vs existing...'));
  return new Promise((resolve, reject) => {
    const batchSize = 35;
    fetchDBArtists().then(
      () => {
        // const sanitizedDbArtists = dbArtists.map((artist) => sanitize(artist));
        let processArtists = async () => {
          let newArtists: { name: string; photo: string; }[] = [];
          let newArtistObj = {};
          // Check new event vs db artists to see which need to be added
          newEvents.forEach((newEvent: any) => {
            newEvent.artists.forEach((rawArtist: string, artistIndex: number) => {
              const artist = sanitize(rawArtist);
              if (artist && !dbArtistObj[artist] && !newArtistObj[artist]) {
                // doesn't exist so create artist + snag photo if its the first of the lineup so it is correct
                newArtists.push({ name: artist, photo: artistIndex === 0 ? newEvent.artistImage : null });
                // create prop on our new artist obj to check against
                // when they are actually added to db we will add to master obj
                newArtistObj[artist] = {};
              }
            });
          });

          // convert array of new artists to nested array for batching
          const artistsArr = createNestedArr(newArtists, batchSize);

          const scrapeArtistLoop = async () => {
            const artistData: any = [];
            let batch = 0;
            console.log(chalk.yellow(`Processing ${newArtists.length} new artists...`));
            // sequentially run through our array of artists via sequential async fns
            await asyncForEach(artistsArr, async (artists: any) => {
              let artistArr = [];
              const browser = await puppeteer.launch();
              const page = await browser.newPage();

              // disabling network timeouts so the whole thing doesn't crash
              await page.goto('https://musicbrainz.org/', { timeout: 0 });
              // wait for page to get started
              await page.waitForSelector('.search-container');

              for (let [index, artist] of artists.entries()) {
                const { name, photo } = artist;
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0);
                process.stdout.write(`Scraping ${name} information, progress: ${(index + 1) + (batch * batchSize)} of ${newArtists.length}`);

                // enter artist and submit to navigate to their page
                page.type('#headerid-query', name);
                await page.waitFor(50);
                page.click('.search-container button[type="submit"]');
                await page.waitForNavigation();

                // click on first result in table (could be wrong of course, but not much you can do)
                if (await page.$('.tbl tbody a') !== null) {
                  const link = await page.evaluate(() => {
                    return document.querySelector('.tbl tbody a')!.getAttribute('href');
                  });
                  await page.goto(`https://musicbrainz.org${link}`, { timeout: 0 });
                } else {
                  artistArr.push({ name, photo, bio: null, twitterUsername: null, twitterUrl: null, facebookUsername: null, facebookUrl: null, instagramUsername: null, instagramUrl: null, soundcloudUsername: null, soundcloudUrl: null, youtubeUsername: null, youtubeUrl: null, spotifyUrl: null, homepage: null });
                  continue;
                }

                await page.waitForSelector('.artistheader');
                // test to see if this helps get more data. Had been not fetching correctly sometimes
                await page.waitFor(300);

                const artistObj = await page.evaluate((artist) => {
                  const { name, photo } = artist;
                  // const sanitize = new Function(' return (' + sanitizeText + ').apply(null, arguments)');

                  const bioSelector = document.querySelector('.wikipedia-extract-body');
                  const homepageSelector = document.querySelector('.external_links .home-favicon a');
                  const twitterSelector = document.querySelector('.external_links .twitter-favicon a');
                  const instagramSelector = document.querySelector('.external_links .instagram-favicon a');
                  const youtubeSelector = document.querySelector('.external_links .youtube-favicon a');
                  const facebookSelector = document.querySelector('.external_links .facebook-favicon a');
                  const soundcloudSelector = document.querySelector('.external_links .soundcloud-favicon a');
                  const spotifySelector = document.querySelector('.external_links .spotify-favicon a');
                  const genresSelector: any = document.querySelector('.genre-list p');

                  return {
                    name,
                    photo,
                    bio: bioSelector ? bioSelector.innerHTML.replace(/\'/g, '\'\'') : null,
                    homepage: homepageSelector ? homepageSelector.getAttribute('href') : null,
                    twitterUrl: twitterSelector ? twitterSelector.getAttribute('href') : null,
                    twitterUsername: twitterSelector ? twitterSelector.innerHTML : null,
                    instagramUrl: instagramSelector ? instagramSelector.getAttribute('href') : null,
                    instagramUsername: instagramSelector ? instagramSelector.innerHTML : null,
                    youtubeUrl: youtubeSelector ? youtubeSelector.getAttribute('href') : null,
                    youtubeUsername: youtubeSelector ? youtubeSelector.innerHTML : null,
                    facebookUrl: facebookSelector ? facebookSelector.getAttribute('href') : null,
                    facebookUsername: facebookSelector ? facebookSelector.innerHTML : null,
                    soundcloudUrl: soundcloudSelector ? soundcloudSelector.getAttribute('href') : null,
                    soundcloudUsername: soundcloudSelector ? soundcloudSelector.innerHTML : null,
                    spotifyUrl: spotifySelector ? spotifySelector.getAttribute('href') : null,
                    genres: genresSelector.innerText === '(none)' ? null : genresSelector.innerText.split(',').map((val: string) => (val.trim()))
                  };
                }, artist, sanitize.toString());
                artistArr.push(artistObj);
              }
              artistData.push(artistArr);
              batch++;

              await browser.close();
              return artistData;
            });
            return [].concat.apply([], artistData);
          }

          let scrapedArtists: any = await scrapeArtistLoop();

          // only adding artist imgs in production
          if (process.env.NODE_ENV === 'production') {
            // convert artist images to our s3 bucket
            const imagesForConverting = scrapedArtists.map(({ name, photo }: { name: string; photo: string; }) => ({ name, photo }));
            uploadImages(imagesForConverting, 'jpg', 'artists/').then(
              (processedImages: any) => {
                // add new s3 urls to scraped artists obj
                processedImages.forEach((image: { photo: string; }, index: number) => {
                  scrapedArtists[index].photo = image.photo;
                });

                // add new artists to db
                createArtists(scrapedArtists).then(
                  (msg: string) => {
                    console.log(chalk.green(msg));

                    // add new genres / links to db from new artists
                    processGenres(scrapedArtists).then(
                      () => resolve(),
                      (err) => reject(err)
                    )
                  },
                  (err) => reject(err)
                )
              }
            )
          } else {
            // add new artists to db
            createArtists(scrapedArtists).then(
              (msg: string) => {
                console.log(chalk.green(msg));

                // add new genres / links to db from new artists
                processGenres(scrapedArtists).then(
                  () => resolve(),
                  (err) => reject(err)
                )
              },
              (err) => reject(err)
            )
          }
        }

        processArtists();
      },
      (err) => reject(err)
    )
  });
}

function compareCities(venues: { city: string }[]) {
  console.log(chalk.yellow('Starting to compare cities...'));
  return new Promise((resolve, reject) => {
    const citiesToAdd: string[] = [];
    const newCitiesObj = {};
    venues.forEach((venue) => {
      const trimmedCity = decodeURI(venue.city).trim();
      if (!dbCitiesObj[trimmedCity] && !newCitiesObj[trimmedCity]) {
        citiesToAdd.push(trimmedCity);
        // add city to our new obj to check against later if exists
        newCitiesObj[trimmedCity] = {};
      }
    });

    if (!citiesToAdd.length) {
      resolve();
      return;
    }

    let sql = 'BEGIN; ';

    citiesToAdd.forEach((city) => {
      sql += `INSERT INTO edm.city(name) VALUES ('${sanitize(city)}'); `;
    });

    // fetching recently added list to snag id to add to dbCitiesObj
    sql += `SELECT id, name, region, country FROM edm.city ORDER BY created_at DESC LIMIT ${citiesToAdd.length};`;

    sql += 'COMMIT;';

    db.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject(err);
      if (data) {
        console.log(chalk.green(`Added ${citiesToAdd.length} cities to the database`));
        // add to master db city obj
        // data comes in as an arr of results and we need to snag the SELECT query with data[1 + citiesToAdd.length] which has the rows
        data[1 + citiesToAdd.length].rows.forEach(({ id, name, region, country }: { id: number; name: string; region: string; country: string; }) => {
          // keys to search by name or id
          dbCitiesObj[name] = { id, region, country, name };
          dbCitiesObj[id] = { id, region, country, name };
        });
        resolve();
      }
    });
  });
}

function fetchDBEvents() {
  return new Promise((resolve, reject) => {
    // if we already have data no need to fetch again
    if (Object.keys(dbEventObj).length) return resolve();

    console.log(chalk.yellow('Fetching db events...'));
    // fetch ids of events from present (start of day) into future and create array
    const sql = `SELECT id FROM edm.event WHERE start_date >= ${moment().startOf('day').valueOf()};`;

    db.query(sql, (err: any, data: { rows: { id: string }[] }) => {
      if (err) reject(err);
      data.rows.forEach(({ id }) => {
        // add event to our master obj to check against later if exists
        dbEventObj[id] = {};
      });
      if (data) resolve();
    });
  });
}

function fetchDBVenues() {
  return new Promise((resolve, reject) => {
    // if we already have data no need to fetch again
    if (Object.keys(dbVenueObj).length) return resolve();

    console.log(chalk.yellow('Fetching db venues...'));
    // fetch names of venues
    const sql = 'SELECT name, city FROM edm.venue;';

    db.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject(err);
      data.rows.forEach(({ name, city }: { name: string; city: number }) => {
        // add sanitized venue to our master obj to check against later if exists
        dbVenueObj[sanitize(name)] = { city };
      });
      if (data) resolve();
    });
  });
}

function fetchDBArtists() {
  return new Promise((resolve, reject) => {
    // if we already have data no need to fetch again
    if (Object.keys(dbArtistObj).length) return resolve();

    console.log(chalk.yellow('Fetching db artists...'));
    // fetch names of artists
    const sql = 'SELECT name FROM edm.artist;';

    db.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject(err);
      data.rows.forEach(({ name }: { name: string; }) => {
        // add sanitized artist to our master obj to check against later if exists
        dbArtistObj[sanitize(name)] = {};
      });
      if (data) resolve();
    });
  });
}

function fetchDBCities() {
  return new Promise((resolve, reject) => {
    // if we already have data no need to fetch again
    if (Object.keys(dbCitiesObj).length) resolve();

    console.log(chalk.yellow('Fetching db cities...'));
    // fetch names of cities
    const sql = 'SELECT id, name, region, country FROM edm.city;';
    db.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject(err);
      data.rows.forEach(({ id, name, region, country }: { id: number; name: string; region: string; country: string; }) => {
        // add city name to our master obj to check against later if exists with id
        dbCitiesObj[name] = { id, region, country, name };
        dbCitiesObj[id] = { id, region, country, name };
      });
      if (data) resolve();
    });
  });
}

function fetchDBGenres() {
  return new Promise((resolve, reject) => {
    // if we already have data no need to fetch again
    if (Object.keys(dbGenreObj).length) return resolve();

    console.log(chalk.yellow('Fetching db genres...'));
    // fetch names of artists
    const sql = 'SELECT name FROM edm.genre;';

    db.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject(err);
      data.rows.forEach((row: { name: string; }) => {
        // add genre to our master obj to check against later if exists
        dbGenreObj[row.name] = {};
      });
      if (data) resolve();
    });
  });
}

function fetchVenueImages(venues: Venue[]): Promise<Venue[]> {
  return new Promise((resolve, reject) => {
    // console.log(chalk.red.bold('SKIPPING venue images...'));
    // resolve(venues);
    // convert venue images to our s3 bucket
    const imagesForConverting = venues.map(({ name, photo }: Venue) => ({ name, photo }));
    uploadImages(imagesForConverting, 'jpg', 'venues/').then(
      (processedImages: any) => {
        // add new s3 urls to og venue object
        processedImages.forEach((image: { photo: string; }, index: number) => {
          venues[index].photo = image.photo;
        });
        resolve(venues);
      },
      (err: any) => reject(err)
    )
  });
}

function createEvents(events: Event[]) {
  console.log(chalk.yellow('Creating events...'));
  return new Promise((resolve, reject) => {
    let sql = 'BEGIN; ';

    events.forEach((event) => {
      const {
        id,
        venue,
        name,
        artists,
        description,
        type,
        startTime,
        endTime,
        ticketProviderId,
        ticketProviderUrl,
        banner
      } = event;

      const sanitizedVenue = sanitize(venue);
      // snag city off venue obj
      const { city } = dbVenueObj[sanitizedVenue];

      if (event) {
        sql += `\
        INSERT INTO edm.event(id, venue, city, region, country, name, description, type, start_date, end_date, ticketProviderId, ticketProviderUrl, banner, approved)\
        VALUES (\
        '${id}',\
        '${sanitizedVenue}',\
        '${dbCitiesObj[city].id}',\
        ${dbCitiesObj[city].region ? "'" + dbCitiesObj[city].region + "'" : null},\
        ${dbCitiesObj[city].country ? "'" + dbCitiesObj[city].country + "'" : null},\
        ${name ? "'" + sanitize(name) + "'" : "'" + artists.map((artist) => (sanitize(artist))).join(', ') + "'"},\
        ${description ? "'" + sanitize(description) + "'" : null},\
        ${type ? "'" + type + "'" : null},\
        ${startTime},\
        ${endTime ? endTime : null},\
        ${ticketProviderId ? "'" + ticketProviderId + "'" : null},\
        ${ticketProviderUrl ? "'" + ticketProviderUrl + "'" : null},\
        ${banner ? "'" + banner + "'" : null}, true)\
        ON CONFLICT (id)\
        DO NOTHING;\
        `;
        // add to our master obj to check against later
        dbEventObj[id] = {};
      }
    });

    sql += 'COMMIT;'

    db.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject({ err, sql });
      if (data) {
        console.log(chalk.green(`Added ${events.length} events to the database`));
        resolve();
      }
    });
  });
}

function createVenues(venues: Venue[]): Promise<string> {
  return new Promise((resolve, reject) => {
    // fetch cities from db to ref the ids
    fetchDBCities().then(
      () => {
        // create city if it doesn't exist yet in db
        compareCities(venues).then(
          () => {
            let sql = 'BEGIN; ';
            venues.forEach((venue) => {
              const {
                name,
                description,
                lat,
                lon,
                city,
                address,
                photo
              } = venue;

              const venueCity = dbCitiesObj[decodeURI(city).trim()];

              sql += `\
              INSERT INTO edm.venue(name, description, lat, lon, city, address, photo, logo)\
              VALUES (\
              '${name}',\
              ${description ? "'" + sanitize(description) + "'" : null},\
              ${lat ? lat : null},\
              ${lon ? lon : null},\
              ${venueCity.id},\
              ${address ? "'" + sanitize(address) + "'" : null},\
              ${photo ? "'" + photo + "'" : null},\
              null);\
              `;
              // add to our master obj to check against later
              dbVenueObj[name] = { city: venueCity.name };
            });

            sql += 'COMMIT;'

            db.query(sql, (err: any, data: { rows: any }) => {
              if (err) reject(err);
              if (data) { resolve(`Added ${venues.length} venues to the database`)};
            });
          }
        )
      },
      (err) => reject(err)
    )
  });
}

function createArtists(artists: Artist[]): Promise<string> {
  return new Promise((resolve, reject) => {
    let sql = 'BEGIN; ';

    artists.forEach((artist) => {
      const {
        name,
        bio,
        photo,
        twitterUsername,
        twitterUrl,
        facebookUsername,
        facebookUrl,
        instagramUsername,
        instagramUrl,
        soundcloudUsername,
        soundcloudUrl,
        youtubeUsername,
        youtubeUrl,
        spotifyUrl,
        homepage
      } = artist;
      if (!dbArtistObj[sanitize(name)]) {
        sql += `\
        INSERT INTO edm.artist(name, description, photo, twitter_username, twitter_url, facebook_username, facebook_url,\
        instagram_username, instagram_url, soundcloud_username, soundcloud_url, youtube_username, youtube_url, spotify_url, homepage)\
        VALUES (\
        '${sanitize(name)}',\
        ${bio ? "'" + bio + "'" : null},\
        ${photo ? "'" + photo + "'" : null},\
        ${twitterUsername ? "'" + sanitize(twitterUsername) + "'" : null},\
        ${twitterUrl ? "'" + twitterUrl + "'" : null},\
        ${facebookUsername ? "'" + sanitize(facebookUsername) + "'" : null},\
        ${facebookUrl ? "'" + facebookUrl + "'" : null},\
        ${instagramUsername ? "'" + sanitize(instagramUsername) + "'" : null},\
        ${instagramUrl ? "'" + instagramUrl + "'" : null},\
        ${soundcloudUsername ? "'" + sanitize(soundcloudUsername) + "'" : null},\
        ${soundcloudUrl ? "'" + soundcloudUrl + "'" : null},\
        ${youtubeUsername ? "'" + sanitize(youtubeUsername) + "'" : null},\
        ${youtubeUrl ? "'" + youtubeUrl + "'" : null},\
        ${spotifyUrl ? "'" + spotifyUrl + "'" : null},\
        ${homepage ? "'" + homepage + "'" : null});\
        `;
        // add to our master obj to check against later
        dbArtistObj[sanitize(name)] = {};
      }
    });

    sql += 'COMMIT;';

    db.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject(err);
      if (data) resolve(`Added ${artists.length} new artists to the database`);
    });
  });
}

function createGenres(genres: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    let sql = 'BEGIN; ';

    genres.forEach((genre) => {
      sql += `INSERT INTO edm.genre(name) VALUES ('${genre}'); `;
      // add to our master obj to check against later
      dbGenreObj[genre] = {};
    });

    sql += 'COMMIT;'

    db.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject(err);
      if (data) resolve(`Added ${genres.length} new genres to the database`);
    });
  });
}

function linkGenresToArtist(artists: { genres: string[]; name: string; }[]) {
  console.log(chalk.yellow('Linking genres to artists...'));
  return new Promise((resolve, reject) => {
    let linksAdded = 0;
    let sql = 'BEGIN; ';

    artists.forEach(({ genres, name }) => {
      if (genres) {
          genres.forEach((genre) => {
          // both id and artist required so the sql statement doesn't fail
          const sanitizedName = sanitize(name);
          if (name && genre && dbArtistObj[sanitizedName]) {
            sql += `INSERT INTO edm.genre_to_artist(genre_id, artist_id) VALUES ('${genre}', '${sanitizedName}'); `;
            linksAdded += 1;
          }
        });
      }
    });

    sql += 'COMMIT;'

    db.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject(err);
      if (data) {
        console.log(chalk.green(`Added ${linksAdded} genre / artist links to the database`));
        resolve();
      };
    });
  });
}

function processGenres(artists: { genres: string[]; name: string; }[]) {
  console.log(chalk.yellow('Processing genres for new artists'));
  return new Promise((resolve, reject) => {
    // fetch genres from db to check against
    fetchDBGenres().then(
      () => {
        const newGenres: string[] = [];
        const newGenresObj = {};
        // check artist genres against existing db ones and add new ones to arr
        artists.forEach((artist) => {
          if (artist.genres) artist.genres.forEach((genre) => {
            if (!dbGenreObj[genre] && !newGenresObj[genre]) {
              newGenres.push(genre);
              // create prop on our new artist obj to check against
              // when they are actually added to db we will add to master obj
              newGenresObj[genre] = {};
            }
          });
        });
        // Now we need to add new genres to db
        createGenres(newGenres).then(
          (msg: string) => {
            console.log(chalk.green(msg));
            // now we need to create artist link with genres
            linkGenresToArtist(artists).then(
              () => resolve(),
              (err) => reject(err)
            )
          }
        )
      }
    )
  });
}

function linkArtistToEvent(events: { artists: string[]; id: number; }[]) {
  console.log(chalk.yellow('Linking artists to events...'));
  return new Promise((resolve, reject) => {
    let linksAdded = 0;
    let sql = 'BEGIN; ';

    events.forEach(({ artists, id }) => {
      artists.forEach((artist) => {
        // both id and artist required so the sql statement doesn't fail as checking to make sure event was added to db
        const sanitizedArtist = sanitize(artist.trim());
        if (id && artist && dbEventObj[id] && dbArtistObj[sanitizedArtist]) {
          sql += `INSERT INTO edm.artist_to_event(artist_id, event_id) VALUES ('${sanitizedArtist}', '${id}'); `;
          linksAdded += 1;
        }
      });
    });

    sql += 'COMMIT;'

    db.query(sql, (err: any, data: { rows: any }) => {
      if (err) {
        console.log('ARTIST TO EVENT ERR SQL: ', sql);
        console.log('ARTIST TO EVENT ERR: ', err);
        reject(err);
      }
      if (data) {
        console.log(chalk.green(`Added ${linksAdded} artist / event links to the database`));
        resolve();
      };
    });
  });
}

function fetchVenueInformation(venues: string[]): Promise<Venue[]> {
  return new Promise((resolve, reject) => {
    let venuePromiseArr: any = [];
    let completedVenueArr: Venue[] = [];

    venues.forEach((venue) => {
      let promise = new Promise((resolve, reject) => {
        //formatting venue and city names
        const venueName = encodeURI(venue.split('-')[0].trim());
        const city = '+%20' + encodeURI(venue.split('-')[venue.split('-').length - 1].trim().split(',')[0]);
        axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${venueName}${city}&key=${process.env.GOOGLE_PLACES_API}`).then(
          ({ data }) => {
            const venueData = data.results[0];
            if (venueData) {
              // fetch photo
              // returns an image so would need to turn around and add to S3 which I don't feel like doing at this second
              const maxPhotoWidth = 800;
              const photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxPhotoWidth}${venueData.photos ? '&photoreference=' + venueData.photos[0].photo_reference : ''}&key=${process.env.GOOGLE_PLACES_API}`;
              completedVenueArr.push({ name: venue, description: null, lat: venueData.geometry.location.lat, lon: venueData.geometry.location.lng, city: city.split('%20').slice(1).join(' '), address: venueData.formatted_address, photo });
            } else {
              completedVenueArr.push({ name: venue, description: null, lat: null, lon: null, city: city.split('+').slice(1).join(' '), address: null, photo: null });
            }
            resolve();
          }
        ).catch((err) => reject(err))
      });
      venuePromiseArr.push(promise);
    });
    Promise.all(venuePromiseArr)
      .then(() => resolve(completedVenueArr))
      .catch((err) => reject(err))
  });
}

let scrapeEventUrls = async (events: Event[]) => {
  // return events;
  console.log(chalk.yellow('Starting to scrape events urls...'));
  if (!events.length) return events;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const abc = (page: Page, event: Event) => {
    return new Promise((resolve) => {
      // would like to set up some error handling to keep the script running
      // need to make sure we don't create an event listener on every loop...
      // or remove the listener
      // https://github.com/GoogleChrome/puppeteer/issues/594
      // https://github.com/GoogleChrome/puppeteer/issues/1981
      page.on('error', listener);
      page.on('pageerror', listener);

      function listener(text: any) {
        console.log('EVENT ID ERROR URL: ', event.id);
        console.log('ERROR ON PAGE: ', text);
      }

      page.goto(event.eventUrl, { timeout: 0 });

      const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      async function recursion() {

        // wait 2 seconds to load up again
        await timeout(2000);
        const url = page.url();
        if (url && url !== 'about:blank') {
          if (url.indexOf('seetickets') !== -1) {
            // See tickets requires the params so not stripping
            event.ticketProviderUrl = url;
          } else {
            // stripping affiliate params
            event.ticketProviderUrl = url.split('?')[0];
          }
          // check event type
          if (url.indexOf('ticketfly') !== -1) {
            event.type = 'ticketfly'
          } else if (url.indexOf('eventbrite') !== -1) {
            event.type = 'eventbrite';
          } else if (url.indexOf('ticketmaster') !== -1) {
            event.type = 'ticketmaster';
          } else if (url.indexOf('seetickets') !== -1) {
            event.type = 'seetickets';
          } else if (url.indexOf('www.etix') !== -1) {
            event.type = 'etix';
          } else {
            event.type = 'other';
          }
          return event;
        } else {
          console.log('Running recursion for event url again...');
          await recursion()
        }
      }

      // checks if there is a url. If not runs fn again until it has one
      (async () => resolve(await recursion()))();

      // remove event listener
      page.removeListener('pageerror', listener);
      page.removeListener('error', listener);
    });
  }

  const mapSeries = async (iterable: any, action: any) => {
    const processedEvents = [];

    for (const [index, x] of iterable.entries()) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`Scraping event url ${index + 1} of ${iterable.length}`);
      const processedEvent = await action(page, x);
      if (processedEvent) {
        processedEvents.push(processedEvent);
      }
    }
    return processedEvents;
  }

  const processedEvents = mapSeries(events, abc);
  await processedEvents;
  await browser.close();

  return processedEvents;
}



// 1000 EB calls per hour
// function fetchEventbriteData(events) {
//   return new Promise((resolve, reject) => {
//     eventCompleteArr = [];
//     eventPromiseArr = [];

//     events.forEach((event, i) => {
//       if (event.ticketProviderId) {
//         eventPromiseArr.push({ promise: axios.get(`https://www.eventbriteapi.com/v3/events/${event.ticketProviderId}/?token=${process.env.EVENTBRITE_API}`).catch(err => reject(err)), i });
//       } else {
//         let eventCopy = {...event};
//         eventCopy.ticketProviderUrl = null;
//         eventCompleteArr.push(eventCopy);
//       }
//     });
//     axios.all(eventPromiseArr.map((event) => event.promise)).then(axios.spread((...args) => {
//       for (let i = 0; i < args.length; i++) {

//         let moddedEvent = {...events[eventPromiseArr[i].i]};
//         moddedEvent.ticketProviderUrl = args[i].data.url;

//         eventCompleteArr.push(moddedEvent);
//       }
//       resolve(eventCompleteArr);
//     })).catch(err => reject(err));
//   });
// }

module.exports = {
  scrapeEvents,
  initScrapeCronJob
};
