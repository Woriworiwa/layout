import { Inject, Injectable, PLATFORM_ID, effect, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import {ThemeModel} from "../models/theme.model";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  _config: ThemeModel = {
    theme: 'mira',
    inputStyle: 'outlined',
    ripple: true,
    scale: 12
  };

  themeSwitcherActive = false;

  config = signal<ThemeModel>(this._config);
  private configUpdate = new Subject<ThemeModel>();
  configUpdate$ = this.configUpdate.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    effect(() => {
      const config = this.config();
      if (isPlatformBrowser(this.platformId)) {
        if (this.updateStyle(config)) {
          this.changeTheme();
        }
        this.changeScale(config.scale);
        this.onConfigUpdate();
      }
    });
  }

  updateStyle(config: ThemeModel) {
    return config.theme !== this._config.theme;
  }

  onConfigUpdate() {
    const config = this.config();
    this._config = { ...config };
    this.configUpdate.next(this.config());
  }

  showConfig() {
    this.themeSwitcherActive = true;
  }

  hideConfig() {
    this.themeSwitcherActive = false;
  }

  changeTheme() {
    const config = this.config();
    const themeLink = <HTMLLinkElement>document.getElementById('app-theme');
    const themeLinkHref = themeLink.getAttribute('href');
    if (!themeLinkHref) {
      return;
    }

    const newHref = themeLinkHref
      .split('/')
      .map(() => `${config.theme}.css`)
      .join('/');

    this.replaceThemeLink(newHref);
  }

  replaceThemeLink(href: string) {
    const id = 'app-theme';
    const themeLink = <HTMLLinkElement>document.getElementById(id);
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');

    if (themeLink.parentNode) {
      themeLink.parentNode.insertBefore(cloneLinkElement, themeLink.nextSibling);
    }

    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
    });
  }

  changeScale(value: number) {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.style.fontSize = `${value}px`;
    }
  }
}
