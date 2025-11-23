import { Component } from '@angular/core';

import {HeaderComponent} from "../shared/header/header.component";

@Component({
  selector: 'app-skeleton',
  imports: [HeaderComponent],
  template: `
    <div class="top">
      <app-header></app-header>
    </div>
    <div class="left">
      <ng-content select="[left-content]"></ng-content>
    </div>
    <div class="center">
      <div class="center-canvas">
        <ng-content select="[center-content]"></ng-content>
      </div>
    </div>
    <div class="right">
      <ng-content select="[right-content]"></ng-content>
    </div>
  `,
  styles: `
    :host {
      display: grid;
      width: 100vw;
      height: 100vh;
      padding: 10px;
      grid-template-areas:
        "header header header"
        "left main right";
      grid-template-columns: minmax(300px, 1fr) 4fr minmax(300px, 1fr);
      grid-template-rows: auto 1fr;
      overflow: clip;
      background-color: var(--bg-primary);
      gap: 10px;

      .top {
        grid-area: header;
      }

      .left {
        overflow: auto;
        grid-area: left;
        display: flex;
        max-width: 340px;
      }

      .right {
        overflow: auto;
        grid-area: right;
        max-width: 340px;
      }

      .center {
        overflow: auto;
        //background-color: var(--surface-100);
        grid-area: main;
        display: flex;
        flex-direction: column;

        .center-canvas {
          overflow: clip;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          border-radius: 1.5rem;
        }
      }
    }
  `
})
export class AppSkeletonComponent {}
