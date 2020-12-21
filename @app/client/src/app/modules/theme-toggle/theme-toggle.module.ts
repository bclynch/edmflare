import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    ThemeToggleComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    FontAwesomeModule
  ],
  exports: [ThemeToggleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThemeToggleModule { }
