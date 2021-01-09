import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistByNameGQL } from '../../../generated/graphql';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faSoundcloud } from '@fortawesome/free-brands-svg-icons/faSoundcloud';
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube';
import { faSpotify } from '@fortawesome/free-brands-svg-icons/faSpotify';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from '../../../services/user.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from '../../../services/app.service';
import startOfDay from 'date-fns/startOfDay';
import { MatSnackBar } from '@angular/material/snack-bar';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit, OnDestroy {

  artist;
  events;
  socialOptions: { url: string, icon }[];
  soundcloudUrl: SafeResourceUrl;

  initSubscription: SubscriptionLike;

  constructor(
    private activatedRoute: ActivatedRoute,
    private artistByNameGQL: ArtistByNameGQL,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private appService: AppService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId,
    private transferState: TransferState
  ) {
    const artist = this.activatedRoute.snapshot.paramMap.get('artistName');
    this.appService.modPageMeta(`${artist} Artist Information`, `Check out artist discography, upcoming shows, and social media information for ${artist}`);

    const ARTIST_KEY = makeStateKey(`artist-${artist}`);

    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          if (this.transferState.hasKey(ARTIST_KEY)) {
            const artistData = this.transferState.get(ARTIST_KEY, null);
            this.transferState.remove(ARTIST_KEY);
            this.artist = artistData;
            console.log('cached artist data', artistData);
            this.finishProcessing();
          } else {
            this.artistByNameGQL.fetch({
              name: artist,
              userId: this.userService.user ? this.userService.user.id : 0,
              // currentDate: startOfDay(new Date()).valueOf()
            }).subscribe(
              ({ data: { artist: artistData } = {} }) => {
                this.artist = artistData;

                if (isPlatformServer(this.platformId)) {
                  this.transferState.set(ARTIST_KEY, artistData);
                }
                console.log('new artist data', artistData);
                this.finishProcessing();
              }
            );
          }
        }
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  finishProcessing() {
    // this is annoying, but cannot really use sql to get this correctly because junction table so front end filter / sort
    this.events = this.artist.artistToEvents.nodes
      .map(({ event }) => event)
      .filter(({ startDate }) => startDate > startOfDay(new Date()).valueOf())
      .sort((a, b) => (a.startDate - b.startDate));
    this.socialOptions = this.generateSocialOptions();
    // generate iframe url for soundcloud widget
    if (this.artist.soundcloudUsername) {
      this.soundcloudUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://w.soundcloud.com/player/?url=https://soundcloud.com/${this.artist.soundcloudUsername}&amp;auto_play=false&amp;buying=false&amp;liking=false&amp;download=false&amp;sharing=false&amp;show_artwork=true&amp;show_comments=false&amp;show_playcount=false&amp;show_user=true&amp;hide_related=false&amp;visual=true&amp;start_track=0&amp;callback=true`);
    }
  }

  generateSocialOptions() {
    const socialOptions = [];
    const { instagramUrl, soundcloudUrl, spotifyUrl, facebookUrl, twitterUrl, youtubeUrl, homepage } = this.artist;
    if (instagramUrl) socialOptions.push({ url: instagramUrl, icon: faInstagram });
    if (soundcloudUrl) socialOptions.push({ url: soundcloudUrl, icon: faSoundcloud });
    if (spotifyUrl) socialOptions.push({ url: spotifyUrl, icon: faSpotify });
    if (facebookUrl) socialOptions.push({ url: facebookUrl, icon: faFacebook });
    if (twitterUrl) socialOptions.push({ url: twitterUrl, icon: faTwitter });
    if (youtubeUrl) socialOptions.push({ url: youtubeUrl, icon: faYoutube });
    if (homepage) socialOptions.push({ url: homepage, icon: faHome });
    return socialOptions;
  }

  followArtist() {
    this.userService.follow(this.artist.name, null, this.artist.name).then(
      ({ data: id, message }) => {
        if (id) {
          this.artist.followLists.nodes = [{ id }];
        }
        this.snackBar.open(message, 'Close', {
          duration: 3000,
        });
      }
    );
  }

  unfollowArtist() {
    this.userService.unfollow(this.artist.followLists.nodes[0].id).then(
      () => this.artist.followLists.nodes = []
    );
  }
}
