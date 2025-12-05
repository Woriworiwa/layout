
import {computed, effect, inject, Injectable, signal, DOCUMENT} from '@angular/core';
import {AppState} from "../store/app.state";
import {MainAreaContent, SideBarPrimary, SideBarSecondary} from "../enums";
import {AppLayoutState} from "../store/app-layout.state";
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
  inspectorVisible = signal<boolean>(false);

  toggleInspector(): void {
    this.inspectorVisible.set(!this.inspectorVisible());
  }



  constructor() {
    this.appState.set({...this.loadAppState()});
    // this.handleDarkModeTransition(this.appState());
    //
    // effect(() => {
    //   const state = this.appState();
    //
    //   if (!this.initialized || !state) {
    //     this.initialized = true;
    //     return;
    //   }
    //   this.saveAppState(state);
    //   this.handleDarkModeTransition(state);
    // });
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
