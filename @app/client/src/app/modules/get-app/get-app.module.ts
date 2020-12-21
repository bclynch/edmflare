import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAppComponent } from './get-app/get-app.component';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    GetAppComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    FontAwesomeModule
  ],
  exports: [GetAppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GetAppModule { }
