import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ENV } from '../environments/environment';

// Apollo
import { GraphQLModule } from './graphql.module';

// Services
import { CookieService } from 'ngx-cookie-service';
import { RoleGuardService } from './services/roleGuard.service';
import { LoginGuardService } from './services/loginGuard.service';
import { AnonGuardService } from './services/anonGuard.service';
import { UtilService } from './services/util.service';
import { EventService } from './services/event.service';
import { RouterService } from './services/router.service';
import { AppService } from './services/app.service';
import { DISQUS_SHORTNAME } from 'ngx-disqus';
import { AnalyticsService } from './services/analytics.service';
import { LocationService } from './services/location.service';
import { UserService } from './services/user.service';
import { EmailService } from './services/email.service';
import { ThemeService } from './services/theme.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    // enhancing the ngsw http://jakubcodes.pl/2018/06/13/enhancing-angular-ngsw/
    ServiceWorkerModule.register('/sw-master.js', { enabled: ENV.production }),
  ],
  providers: [
    RoleGuardService,
    LoginGuardService,
    AnonGuardService,
    UtilService,
    EventService,
    RouterService,
    CookieService,
    AppService,
    AnalyticsService,
    LocationService,
    UserService,
    EmailService,
    ThemeService,
    { provide: DISQUS_SHORTNAME, useValue: ENV.disqusShortname }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
