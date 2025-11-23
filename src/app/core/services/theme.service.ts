import {Inject, Injectable, PLATFORM_ID, effect, signal, inject, DOCUMENT} from '@angular/core';
import { Subject } from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import {ThemeModel} from "../models/theme.model";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  _config: ThemeModel = {
    theme: 'mdc-deeppurple',
    inputStyle: 'outlined',
    ripple: true,
    scale: 12,
    darkMode: false
  };

  themeSwitcherActive = false;

  config = signal<ThemeModel>(this._config);
  private configUpdate = new Subject<ThemeModel>();
  configUpdate$ = this.configUpdate.asObservable();
  document = inject(DOCUMENT);

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

  toggleDarkMode() {
    if (this.config().darkMode) {
      this.document.documentElement.classList.remove('p-dark');
    } else {
      this.document.documentElement.classList.add('p-dark');
    }

    this._config.darkMode = !this.config().darkMode;
  }
  updateStyle(config: ThemeModel) {
    return config.theme !== this._config.theme || config.darkMode !== this._config.darkMode;
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
      .map(() => `${config.theme}${config.darkMode? '-dark': '-light'}.css`)
      .join('/');

    this.replaceThemeLink(newHref, 'app-theme');
    this.replaceThemeLink(`prism${config.darkMode? '-dark': '-light'}.css`, 'prism-theme');
  }

  replaceThemeLink(href: string, id: string) {
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
