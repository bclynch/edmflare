import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { AnonGuardService as AnonGuard } from '../../services/anonGuard.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const routes: Routes = [
  {
    path: '',
    component: CreateComponent,
    canActivate: [AnonGuard]
  }
];

@NgModule({
  declarations: [CreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule
  ]
})
export class CreateModule { }
