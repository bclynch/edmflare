import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(
    private cookieService: CookieService
  ) {}

  getUserTheme() {
    const cookieTheme = this.cookieService.get('edm-theme');
    if (cookieTheme) {
      cookieTheme === 'dark' ? this.toggleDark() : this.toggleLight();
    } else {
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? this.toggleDark() : this.toggleLight();
    }
  }

  toggleDark() {
    this.setTheme(darkTheme);
    this.theme = 'dark';
    this.cookieService.set('edm-theme', this.theme);
  }

  toggleLight() {
    this.setTheme(lightTheme);
    this.theme = 'light';
    this.cookieService.set('edm-theme', this.theme);
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
