import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserTransferStateModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ENV } from '../environments/environment';

// Apollo
import { GraphQLModule } from './graphql.module';

// 3rd party modules
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import * as Cloudinary from 'cloudinary-core';
import { AgmCoreModule } from '@agm/core';

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
import { UserService } from './services/user.service';
import { ThemeService } from './services/theme.service';
import { GlobalObjectService } from './services/globalObject.service';
import { DeviceService } from './services/device.service';
import { RouterStateService } from './services/routerState.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    AppRoutingModule,
    GraphQLModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CloudinaryModule.forRoot(Cloudinary, { cloud_name: ENV.cloudinaryCloudName } as CloudinaryConfiguration),
    AgmCoreModule.forRoot({
      apiKey: ENV.googleAPIKey
    }),
    // enhancing the ngsw http://jakubcodes.pl/2018/06/13/enhancing-angular-ngsw/
    ServiceWorkerModule.register('/sw-master.js', { enabled: ENV.production })
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
    UserService,
    ThemeService,
    GlobalObjectService,
    DeviceService,
    RouterStateService,
    { provide: DISQUS_SHORTNAME, useValue: ENV.disqusShortname }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
