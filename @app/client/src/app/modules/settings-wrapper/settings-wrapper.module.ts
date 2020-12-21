import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsWrapperComponent } from './settings-wrapper/settings-wrapper.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SettingsWrapperComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  exports: [SettingsWrapperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsWrapperModule { }
