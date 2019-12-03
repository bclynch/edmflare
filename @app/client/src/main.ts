import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { ENV } from './environments/environment';
import './icons';
import 'hammerjs';

if (ENV.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
  // workaround for issue https://github.com/angular/angular-cli/issues/13351
  if ('serviceWorker' in navigator && ENV.production) {
    navigator.serviceWorker.register('/ngsw-worker.js');
  }
}).catch(err => console.log(err));
