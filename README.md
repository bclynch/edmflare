# EDM Flare

## Table of contents

-   [Features](#features)
-   [Todos](#todos)
-   [Prerequisites](#prerequisites)
-   [Getting Started](#getting-started)
-   [Running](#running)
-   [Production build](#production-build-for-local-mode)

## Todos

### MVP

- ~~External links not scraping properly...~~
- ~~Fix problems with edmtrain logo being used as default + reverse ones that made it through~~
- Email working again would be great
- ~~Work on some url seo perhaps? Event page anyway~~
  - For future projects look at something like eventbrite for a good seo example. Used slug desc / title + an id on the end to keep it flat. If only id then redirects to add description.
- Social SSR things
- Need some better error handling on routes that don't exist. i.e. artist page that returns no data should throw 404
  - Not sure how to deal with this when no artist value... How do we 404 w/o wiping out the url?
- ~~[Animations](https://stackoverflow.com/questions/40413133/angular-2-throwing-error-outlet-is-not-activated) on route changes for mobile~~
- Docker + CI pipeline?!? Bleh

## Mobile Apps

- Capacitor works with Angular universal + material 🤔
- SPIKE: Deployment -- Fastlane or App Flow with CI/CD docker. How about with multiple apps (if ever went down custom site path)??
  - Perhaps [App Center](https://appcenter.ms/) could prove useful for building
    - [More](https://www.kevinboosten.dev/release-your-ionic-and-capacitor-app-via-appcenter)
    - [And more](https://medium.com/@arielhernandezmusa/building-ionic-capacitor-on-appcenter-fe0105bb02d1)
  - [App Flow](https://ionicframework.com/appflow) from Ionic
  - [Bitrise](https://www.bitrise.io/)

### Todos

- ~~Make sure login / cookies working~~
  - ~~Working on iOS persisting across builds~~
  - ~~Login works on android, but seems like [not persisted](https://github.com/ionic-team/capacitor/issues/3012#issuecomment-636017770)?~~
- Use my current location not working native
  - ~~Using capacitor get location~~
  - ~~Web + android works~~
  - ios the fn fails to return anything --> [Info](https://github.com/ionic-team/capacitor/issues/3789)
- ~~Get Access-Control-Allow-Origin headers working. Currently breaks CORS on web with extra ones~~
- ~~Need to refactor client envs a little since server base url is different between ios and android~~
- ~~Swap in native share module~~
- ~~Check maps works~~
- ~~Might be worth making a device service using Capacitor.platform for usage around the app~~
- ~~Splash Screen~~
- ~~App Icon~~
- Push notifications
- ~~Safe area styling~~

### Running things

- Make sure a build is done on the client (could be with yarn dev:ssr)
- Copy the files to the mobile apps --> `npx cap copy`
- Open up in the native IDEs --> `npx cap open <ios|android>`

### Configuration

#### Splash Screen

  - Used [this](https://pgicons.abiro.com/) for basic splash
  - Needed this [site](https://apetools.webprofusion.com/#/tools/imagegorilla) to generate proper 2732x2732 img bleh
  - Can be helpful to follow [this](https://www.joshmorony.com/adding-icons-splash-screens-launch-images-to-capacitor-projects/) on where / how to swap assets. In the ide is handy
  - Need to close emulator / delete app and rebuild for splash to show on ios

#### App Icon

  - Need to start with 1024px png
  - Generate sizes [here](https://resizeappicon.com/). Has enough for all ios. Android will create it's own with the directions listed in above article.

### Networking

- It works!!! 🎉

#### iOS

- On the server need to have a localhost Access-Control-Allow-Methods --> `res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');`
- On the server need to have a localhost Access-Control-Allow-Origin --> `res.header('Access-Control-Allow-Origin', 'capacitor://localhost');`
- Normal localhost url works --> http://localhost:5000

#### Android

- For Android add the following to android/app/src/main/AndroidManifest.xml
```
<application
        android:usesCleartextTraffic="true"
        ...
</application>
```
- On the server need to have a localhost Access-Control-Allow-Origin --> `res.header('Access-Control-Allow-Origin', 'http://localhost');`
- The address is not localhost, but rather `http://<computer-ipadress>:<port>` or currently `http://192.168.0.165:5000`
- For cookie persistence [read this](https://github.com/ionic-team/capacitor/issues/3012#issuecomment-636017770)

### iOS

#### Debugging
- To debug go to safari --> develop menu --> simulator dropdown then select dev tools to open

### Android

#### Debugging
- To debug with chrome dev tools go to chrome://inspect/#devices in Chrome and inspect the emulator

### Optimizations

- Password check on registration didn't work
- User setup not working
- Look at lazy loading elements farther down page (i.e. event cards on home page)
- ~~Get some larger libs out of services being parsed at the start / look at services not on app.module~~
- Need to fix the static backgrounds on cards / events. Too compressed
- Look at cookie issue connect.sid
- ~~Fix scraping~~
  - In good shape. Artist description might be broken
- Emails?
- ~~Work on virtual scroll~~
  - Should set fixed height on overall for both mobile + desktop
  - Imgs still being odd flipping around
- Lazy load hero banner carousel on home page
- Would be nice to make all our slugs lower case as is normal. Currently it is case sensitive so different spelling being scraped are creating different db values for artists. Would be nice to merge them eventully too
- Universal angular? -- It works!! 🥳🎉
  - State transfer -- in progress
  - ~~Basic SSR on local dev with demo server~~
  - How does styles work?? Can import all the style sheets to styles.scss, but is that normal?
    - Tough to find out user pref on light vs dark. Can use this [article](https://hangindev.com/blog/avoid-flash-of-default-theme-an-implementation-of-dark-mode-in-react-app) perhaps?
  - ~~Fix window instances~~
  - ~~Home module is messed up. Perhaps cloudinary issue~~
  - [Cloudinary lazy broken](https://github.com/cloudinary/cloudinary_angular/issues/299). Maybe don't need for SSR?
  - Faster first paint
  - Flash issue on Firefox
  - SEO for search egines
  - Social media crawlers***
    - Try and centralize it in the app service and can remove from the static index.html
  - Virtual scroll is crap on events. Images jacked up and kind of janky
  - [Guide](https://blog.angular-university.io/angular-universal/)
- See if geocoding for venues is working?

### Other

- Would like to get angular universal going?
- ~~Share btns broken after ng 9. Look for [new version soon](https://github.com/MurhafSousli/ngx-sharebuttons/issues/429)~~
- [Add Capacitor for app generation](https://blog.angular.io/announcing-the-capacitor-ngadd-schematic-732fd90f40fa) (try on a branch)
- Domain issues with social logins (fuck)
  - [Look at trying to have express serve the static app instead of nginx](https://itnext.io/express-server-for-an-angular-application-part-1-getting-started-2cd27de691bd)
-   ~~Do db migration stuff with existing model~~
    -   ~~Trying to run setup script is not creating db in postgres. Template db
        exists, but is not in pgadmin~~
-   Wire up client to play nice here
    -   ~~[Proxy info with angular to play nice CORS](https://levelup.gitconnected.com/simple-application-with-angular-6-node-js-express-2873304fff0f)~~
    -   Fix createdAt filter for search queries
    -   ~~Figure out how to logout~~
    -   ~~Fix misc issues with refactored db~~
    -   ~~Next month util range is broken~~
    -   ~~Set up password forget~~
    -   ~~Set up password reset~~
    -   ~~Fix email to work with SES~~
    -   ~~Set up fb login~~
    -   ~~Set up google log in~~
    -   ~~Set up twitter log in~~
    -   Make sure deleting users and such doesn't fuck up the userid and id balance
    -   ~~Fix local login~~
    -   ~~Show user photo in login / logged in btn in nav~~
    -   Walk user through a newly registered page
        -   ~~Show theme~~
        -   ~~Show apps~~
        -   ~~Setup fav locales~~
        -   Set up notifications
        - ~~Would be nice to have an option in the dropdown menu that sends you to the user setup page if it hasn't been "completed". This is handy since the social logins won't send user there. When completed turn boolean on user object so it's out of the menu~~
    -   ~~Rework login / register page~~
-   Bring back existing functionality on server with TS
    - ~~Scraping~~
    - Welcome Email
    - ~~Img uploading~~
    - Push notifications
    - ~~Utils~~
-   Migrating existing db to new one. Probably need some kind of script
    - ~~Create script and run locally~~
    - ~~*UPDATE CITIES TABLE SO NEW ROWS HAVE UPDATED COUNTRY / REGION*~~
-   ~~Fix up look of the emails that are going out to people. Mostly just changing color scheme and maybe add logo~~
-   Look at Docker for production
    - See about getting a proper CI going with the github workflow here
- Look at getting scrape and daily email hooked up to our worker to offload them there
  - ~~Would need to reformat handlebar emails to the other thing~~
    - ~~Contact~~
    - ~~Events update~~
    - Scrape update needs a little TLC
  - ~~[You can schedule jobs directly in the database, e.g. from a trigger or function, or by calling SQL from your application code.](https://github.com/graphile/worker#scheduling-jobs)~~
- Inputs on location search look weird with text and placeholder

## Running Local Dev Currently

```
// open different terminal instances for ea

// watch for tsc changes on server
yarn server watch

// run server
yarn server dev

// server worker instance
yarn worker dev

// spin up Angular client
yarn client start
```

## Digital Ocean Login

- `$ ssh edmflare@206.189.194.173`
  - Update ubuntu packages every now and then with `sudo apt-get update && sudo apt-get dist-upgrade`

## Prerequisites

You can either work with this project locally (directly on your machine) or use
a pre-configured Docker environment. We'll differentiate this in the README with
a table like this one:

| Local mode                      | OR  | Docker mode                              |
| ------------------------------- | :-: | ---------------------------------------- |
| _command for local development_ | or  | _command for docker-compose development_ |

**Be careful not to mix and match Docker-mode vs local-mode for development.**
You should make a choice and stick to it. (Developing locally but deploying with
`production.Docker` is absolutely fine.)

**IMPORTANT**: If you choose the Docker mode, be sure to read
[docker/README.md](docker/README.md).

### Local development

Requires:

-   Node.js v10+ must be installed (v12 recommended)
-   PostgreSQL v10+ server must be available
-   `pg_dump` command must be available (or you can remove this functionality)
-   VSCode is recommended, but any editor will do

This software has been developed under Mac and Linux, and should work in a
`bash` environment.

## Getting started

This project is designed to work with `yarn`. If you don't have `yarn`
installed, you can install it with `npm install -g yarn`. The Docker setup
already has `yarn` & `npm` installed and configured.

To get started, please run:

| Local mode   | OR  | Docker mode                     |
| ------------ | :-: | ------------------------------- |
| `yarn setup` | or  | `export UID; yarn docker setup` |

This command will lead you through the necessary steps, and create a `.env` file
for you containing your secrets.

**NOTE:** `export UID` is really important on Linux Docker hosts, otherwise the
files and folders created by Docker will end up owned by root, which is
non-optimal. We recommend adding `export UID` to your `~/.profile` or
`~/.bashrc` or similar so you don't have to remember it.

**Do not commit `.env` to version control!**

## Running

You can bring up the stack with:

| Local mode   | OR  | Docker mode                     |
| ------------ | :-: | ------------------------------- |
| `yarn start` | or  | `export UID; yarn docker start` |

After a short period you should be able to load the application at
http://localhost:5000

This main command runs a number of tasks:

-   uses [`graphile-migrate`](https://github.com/graphile/migrate) to watch
    the`migrations/current.sql` file for changes, and automatically runs it
    against your database when it changes
-   watches the TypeScript source code of the server, and compiles it from
    `@app/*/src` to `@app/*/dist` so node/`graphile-worker`/etc. can run the
    compiled code directly
-   runs the node server (includes PostGraphile and Next.js middleware)
-   runs `graphile-worker` to execute your tasks (e.g. sending emails)
-   watches your GraphQL files and your PostGraphile schema for changes and
    generates your TypeScript React hooks for you automatically, leading to
    strongly typed code with minimal effort
-   runs the `jest` tests in watch mode, automatically re-running as the database
    or test files change

**NOTE**: `docker-compose up server` also runs the PostgreSQL server that the
system connects to.

You may also choose to develop locally, but use the PostgreSQL server via
`docker-compose up -d db`.

Then for development you may need a console; you can open one with:

| Local mode | OR  | Docker mode                    |
| ---------- | :-: | ------------------------------ |
| `bash`     | or  | `export UID; yarn docker bash` |

To shut everything down:

| Local mode | OR  | Docker mode                    |
| ---------- | :-: | ------------------------------ |
| Ctrl-c     | or  | `export UID; yarn docker down` |

## Production build for local mode

Use `yarn run build` to generate a production build of the project

## AWS Setup
- Email is only available from US East N. Virginia and US West Oregon so keep that in mind...

### SES

- *MUST LEAVE SANDBOX WHEN PROD READY OR EMAILS TO UNVERIFIED EMAILS BREAK*
  - [Docs to leave sandbox](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html)
- $0.10 for every 1,000 emails you send or receive.
- https://medium.com/viithiisys/node-mailer-with-amazon-ses-6fb18bea568e
- Head over to SES in the [AWS console](https://console.aws.amazon.com/ses/home)
- [Verify a new domain](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domain-procedure.html) to be able to send emails from
  - Enter the domain, click to select dkim, and get the network settings needed to add to the domain. Should be three cname and one txt
- If your account is still in the Amazon SES sandbox, you also must verify every recipient email address except for the recipients provided by the Amazon SES mailbox simulator.

### RDS

- Important reminders:
    - Set the option for making the db public so you get an endpoint for it. Must be done on creation!
    - Set inbound security group to be all traffic (something like 0.0.0.0) otherwise it hangs and doesn't work
#### Basic Setup
- Install AWS CLI `$ brew install awscli`
- Launch a new RDS instance from AWS console
- Run `$ aws rds describe-db-instances` to check on your db's info
- Change the parameter group of your instance to force ssl. (set to one)
#### Connect to Postgres GUI
- http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html
- Can right click on a db and select 'Execute SQL File'. Load up the schema then load up any data.
- When running sql the first time to set up dbs and roles and such RDS does not allow `COMMENT ON EXTENSION`. If it exists anywhere in the sql needs to be removed.

## Postgres Indexing
- https://devcenter.heroku.com/articles/postgresql-indexes
- When you are ready to apply an index on your production database, keep in mind that creating an index locks the table against writes. For big tables that can mean your site is down for hours. Fortunately Postgres allows you to CREATE INDEX CONCURRENTLY, which will take much longer to build, but does not require a lock that blocks writes. Ordinary CREATE INDEX commands require a lock that blocks writes but not reads.
- Finally, **indexes will become fragmented and unoptimized after some time, especially if the rows in the table are often updated or deleted.** In those cases it may be required to perform a REINDEX leaving you with a balanced and optimized index. However be cautious about reindexing big indexes as write locks are obtained on the parent table. One strategy to achieve the same result on a live site is to build an index concurrently on the same table and columns but with a different name, and then dropping the original index and renaming the new one. This procedure, while much longer, won’t require any long running locks on the live tables.
- Look more closely at the api calls we make regularly for where statements / joins and create indicies for those columns

### Rules of thumb
- Index every primary key. (postgres does this)
- Index every foreign key.
- Index every column used in a JOIN clause.
- Index every column used in a WHERE clause.

## Postgres Setup
- Important note that I am using a newly created role, edm_super, in my db/index.js pg connection so it has super user connection on the server only. Otherwise my graphql server is set to my edm_adm role without super user and should respect the roles
- No super users on AWS, but the rds_superuser role is a pre-defined Amazon RDS role similar to the PostgreSQL superuser role
