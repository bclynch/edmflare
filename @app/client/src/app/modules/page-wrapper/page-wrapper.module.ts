import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagewrapperComponent } from './pagewrapper/pagewrapper.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivesModule } from '../../directives/directives.module';
import { ThemeToggleModule } from '../theme-toggle/theme-toggle.module';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    PagewrapperComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    ThemeToggleModule,
    CloudinaryModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    FontAwesomeModule,
    MatSnackBarModule
  ],
  exports: [PagewrapperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageWrapperModule { }
