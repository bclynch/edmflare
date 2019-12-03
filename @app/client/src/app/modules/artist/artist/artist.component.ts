import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistByNameGQL } from 'src/app/generated/graphql';
import { faTwitter, faFacebook, faInstagram, faSoundcloud, faYoutube, faSpotify, IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import * as moment from 'moment';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit, OnDestroy {

  artist;
  events;
  socialOptions: { url: string, icon: IconDefinition }[];
  soundcloudUrl: SafeResourceUrl;

  initSubscription: SubscriptionLike;

  constructor(
    private activatedRoute: ActivatedRoute,
    private artistByNameGQL: ArtistByNameGQL,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private appService: AppService
  ) {
    const artist = this.activatedRoute.snapshot.paramMap.get('artistName');
    this.appService.modPageMeta(`${artist} Artist Information`, `Check out artist discography, upcoming shows, and social media information for ${artist}`);
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.artistByNameGQL.fetch({
            name: artist,
            userId: this.userService.user ? this.userService.user.id : 0,
            // currentDate: moment().startOf('day').valueOf()
          }).subscribe(
            ({ data }) => {
              this.artist = data.artist;
              // this is annoying, but cannot really use sql to get this correctly because junction table so front end filter / sort
              this.events = this.artist.artistToEvents.nodes.map((event) => event.event).filter((e) => e.startDate > moment().startOf('day').valueOf()).sort((a, b) => (a.startDate - b.startDate));
              this.socialOptions = this.generateSocialOptions();
              // generate iframe url for soundcloud widget
              if (this.artist.soundcloudUsername) this.soundcloudUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://w.soundcloud.com/player/?url=https://soundcloud.com/${this.artist.soundcloudUsername}&amp;auto_play=false&amp;buying=false&amp;liking=false&amp;download=false&amp;sharing=false&amp;show_artwork=true&amp;show_comments=false&amp;show_playcount=false&amp;show_user=true&amp;hide_related=false&amp;visual=true&amp;start_track=0&amp;callback=true`);
            }
          );
        }
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  generateSocialOptions() {
    const socialOptions = [];
    if (this.artist.instagramUrl) socialOptions.push({ url: this.artist.instagramUrl, icon: faInstagram });
    if (this.artist.soundcloudUrl) socialOptions.push({ url: this.artist.soundcloudUrl, icon: faSoundcloud });
    if (this.artist.spotifyUrl) socialOptions.push({ url: this.artist.spotifyUrl, icon: faSpotify });
    if (this.artist.facebookUrl) socialOptions.push({ url: this.artist.facebookUrl, icon: faFacebook });
    if (this.artist.twitterUrl) socialOptions.push({ url: this.artist.twitterUrl, icon: faTwitter });
    if (this.artist.youtubeUrl) socialOptions.push({ url: this.artist.youtubeUrl, icon: faYoutube });
    if (this.artist.homepage) socialOptions.push({ url: this.artist.homepage, icon: faHome });
    return socialOptions;
  }

  followArtist() {
    this.userService.follow(this.artist.name, null, this.artist.name).then(
      (followId) => this.artist.followLists.nodes = [{ id: followId }]
    );
  }

  unfollowArtist() {
    this.userService.unfollow(this.artist.followLists.nodes[0].id).then(
      () => this.artist.followLists.nodes = []
    );
  }
}
