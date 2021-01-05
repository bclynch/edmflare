import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
import { GlobalObjectService } from './globalObject.service';

const darkTheme = {
  'color-primary': 'black',
  'color-accent': '#ffc107',
  'color-background': '#303030',
  'color-header': 'black',
  'color-font': 'white'
};

const lightTheme = {
  'color-primary': '#546e7a',
  'color-accent': '#ffc107',
  'color-background': 'white',
  'color-header': 'white',
  'color-font': 'black'
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = 'light';
  windowRef;

  constructor(
    private cookieService: CookieService,
    private globalObjectService: GlobalObjectService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.windowRef = this.globalObjectService.getWindow();
  }

  getUserTheme() {
    const cookieTheme = this.cookieService.get('edm-theme');
    if (cookieTheme) {
      cookieTheme === 'dark' ? this.toggleDark() : this.toggleLight();
    } else {
      if (isPlatformBrowser(this.platformId)) {
        this.windowRef.matchMedia && this.windowRef.matchMedia('(prefers-color-scheme: dark)').matches
          ? this.toggleDark()
          : this.toggleLight();
      }
    }
  }

  toggleDark() {
    this.setTheme(darkTheme);
    this.theme = 'dark';
    this.cookieService.set('edm-theme', this.theme, null, null, null, false, 'Strict');
  }

  toggleLight() {
    this.setTheme(lightTheme);
    this.theme = 'light';
    this.cookieService.set('edm-theme', this.theme, null, null, null, false, 'Strict');
  }

  toggleTheme() {
    this.theme === 'light' ? this.toggleDark() : this.toggleLight();
  }

  private setTheme(theme: {}) {
    Object.keys(theme).forEach(k =>
      document.documentElement.style.setProperty(`--${k}`, theme[k])
    );
  }
}
