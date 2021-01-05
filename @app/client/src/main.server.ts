import { enableProdMode } from '@angular/core';

import { ENV } from './environments/environment';

if (ENV.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { renderModule, renderModuleFactory } from '@angular/platform-server';
