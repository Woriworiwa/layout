import {DOCUMENT} from '@angular/common';
import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {AppState} from "./store/app.state";
import {MainAreaContent, SideBarPrimary, SideBarSecondary} from "./models/enums";
import {AppLayoutState} from "./store/app-layout.state";
import {HighlightLoader} from "ngx-highlightjs";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private readonly STORAGE_KEY = 'appConfigState';
  private initialized = false;
  private document = inject(DOCUMENT);

  appState = signal<AppState>({});
  layoutState = signal<AppLayoutState>({
    mainAreaContent: MainAreaContent.CANVAS,
    sideBarPrimary: SideBarPrimary.insert,
    sideBarSecondary: SideBarSecondary.CSS
  });

  theme = computed(() => (this.appState()?.darkTheme ? 'stackoverflow-dark' : 'stackoverflow-light'));

  transitionComplete = signal<boolean>(false);
  private hljsLoader: HighlightLoader = inject(HighlightLoader);

  constructor() {
    this.appState.set({...this.loadAppState()});
    this.handleDarkModeTransition(this.appState());

    effect(() => {
      const state = this.appState();

      if (!this.initialized || !state) {
        this.initialized = true;
        return;
      }
      this.saveAppState(state);
      this.handleDarkModeTransition(state);
    });
  }

  setAppLayout(newState: AppLayoutState): void {
    const currentState = this.layoutState();

    if (newState.mainAreaContent && currentState.mainAreaContent === MainAreaContent.CODE) {
      newState.sideBarPrimary = SideBarPrimary.insert;
    }

    if (newState.sideBarPrimary === SideBarPrimary.code) {
      newState.mainAreaContent = MainAreaContent.CODE;
    } else if (!newState.sideBarSecondary && currentState.mainAreaContent === MainAreaContent.CODE) {
      newState.mainAreaContent = MainAreaContent.CANVAS;
    }

    this.layoutState.update(state => ({
      ...state,
      ...newState
    }));
  }

  private handleDarkModeTransition(state: AppState): void {
    if ((document as any).startViewTransition) {
      this.startViewTransition(state);
    } else {
      this.toggleDarkMode(state);
      this.onTransitionEnd();
    }
  }

  private startViewTransition(state: AppState): void {
    const transition = (document as any).startViewTransition(() => {
      this.toggleDarkMode(state);
    });

    transition.ready.then(() => this.onTransitionEnd());
  }

  private toggleDarkMode(state: AppState): void {
    if (state.darkTheme) {
      this.document.documentElement.classList.remove('p-dark');
      this.hljsLoader.setTheme('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/base16/google-light.min.css');
    } else {
      this.document.documentElement.classList.add('p-dark');
      this.hljsLoader.setTheme('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/base16/google-dark.min.css');
    }
  }

  private onTransitionEnd() {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }

  private loadAppState(): any {
    const storedState = localStorage.getItem(this.STORAGE_KEY);
    if (storedState) {
      return JSON.parse(storedState);
    }

    return {
      preset: 'Aura',
      primary: 'noir',
      surface: null,
      darkTheme: false,
      menuActive: false,
      designerKey: 'primeng-designer-theme'
    };
  }

  private saveAppState(state: any): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }
}
