import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LocationSearchModule } from '../location-search/location-search.module';
import { EventCardAltModule } from '../event-card-alt/event-card-alt.module';
import { SelectDateModule } from '../select-date/select-date.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GetAppModule } from '../get-app/get-app.module';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    FontAwesomeModule,
    LocationSearchModule,
    EventCardAltModule,
    SelectDateModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    GetAppModule,
    CloudinaryModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
