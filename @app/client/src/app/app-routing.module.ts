import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'artist',
    loadChildren: () => import('./modules/artist/artist.module').then(m => m.ArtistModule),
  },
  {
    path: 'venue',
    loadChildren: () => import('./modules/venue/venue.module').then(m => m.VenueModule),
  },
  {
    path: 'events',
    loadChildren: () => import('./modules/events/events.module').then(m => m.EventsModule),
  },
  {
    path: 'event',
    loadChildren: () => import('./modules/event/event.module').then(m => m.EventModule),
  },
  {
    path: 'map',
    loadChildren: () => import('./modules/map/map.module').then(m => m.MapModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('./modules/signup/signup.module').then(m => m.SignupModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
  },
  {
    path: 'create-event',
    loadChildren: () => import('./modules/create/create.module').then(m => m.CreateModule),
  },
  {
    path: 'locations',
    loadChildren: () => import('./modules/locations/locations.module').then(m => m.LocationsModule),
  },
  {
    path: 'policies',
    loadChildren: () => import('./modules/policies/policies.module').then(m => m.PoliciesModule),
  },
  {
    path: 'about',
    loadChildren: () => import('./modules/about/about.module').then(m => m.AboutModule),
  },
  {
    path: 'contact',
    loadChildren: () => import('./modules/contact/contact.module').then(m => m.ContactModule),
  },
  {
    path: 'settings',
    redirectTo: 'settings/user-profile',
    pathMatch: 'full'
  },
  {
    path: 'settings/user-profile',
    loadChildren: () => import('./modules/user-profile/user-profile.module').then(m => m.UserProfileModule),
  },
  {
    path: 'settings/password',
    loadChildren: () => import('./modules/password/password.module').then(m => m.PasswordModule),
  },
  {
    path: 'settings/notification-preferences',
    loadChildren: () => import('./modules/notification-preferences/notification-preferences.module').then(m => m.NotificationPreferencesModule),
  },
  {
    path: 'settings/close-account',
    loadChildren: () => import('./modules/close-account/close-account.module').then(m => m.CloseAccountModule),
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./modules/password-reset/password-reset.module').then(m => m.PasswordResetModule),
  },
  {
    path: 'unsubscribe',
    loadChildren: () => import('./modules/unsubscribe/unsubscribe.module').then(m => m.UnsubscribeModule),
  },
  {
    path: 'faqs',
    loadChildren: () => import('./modules/faqs/faqs.module').then(m => m.FaqsModule),
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./modules/verify-email/verify-email.module').then(m => m.VerifyEmailModule),
  },
  { path: '**', loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
