import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HtmlSerializer} from "../serialization/serializers/html.serializer";
import {UnsafeHtmlPipe} from "./unsafe-html.pipe";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CanvasItem} from "../core/models/canvas-item.model";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {CanvasService} from "../canvas/canvas.service";

@Component({
    selector: 'app-preview',
    imports: [CommonModule, UnsafeHtmlPipe, DropdownModule, FormsModule],
    template: `
    <div class="screen-size-selector">
      <div>
        <label>Screen width: </label>
        <p-dropdown [options]="mediaQueries"
                    [(ngModel)]="selectedMediaQuery"
                    optionLabel="name"
                    [showClear]="false"></p-dropdown>
      </div>
    </div>

    <div class="iframe-container">
      <iframe [srcdoc]="code | unsafeHtml"
              [ngStyle]="{ 'width': selectedMediaQuery?.width, 'flex-grow': 1}"></iframe>
    </div>
  `,
    styles: `
    :host {
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .iframe-container {
      overflow: auto;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      iframe {
        border: none;
        height: 100%;
      }
    }

    .screen-size-selector {
      display: flex;
      padding: 4px;
      justify-content: center;

      > div > label {
        margin-right: 10px;
      }
    }
  `
})
export class PreviewComponent {
  code: any;
  serializer: HtmlSerializer = new HtmlSerializer();
  mediaQueries: { name: string, width: string }[] = [{
    name: 'auto',
    width: '100%',
  }, {
    name: 'Desktops (1920)',
    width: '1920px'
  }, {
    name: 'Desktops (1280)',
    width: '1280px',
  }, {
    name: 'Tablets, Ipads (1024px)',
    width: '1024px',
  }, {
    name: 'Mobiles, Ipads (767px)',
    width: '767px',
  }, {
    name: 'Small mobiles (480px)',
    width: '480px',
  }
  ];

  protected selectedMediaQuery: { name: string, width: string } | undefined = this.mediaQueries[this.mediaQueries.findIndex((mq: { name: string, width: string }) => mq.name === 'Tablets, Ipads (1024px)')];

  constructor(private canvasService: CanvasService) {
    this.canvasService.items$
      .pipe(takeUntilDestroyed())
      .subscribe((items: CanvasItem[]) => {
        this.code = this.serializer.serialize(items).join('\n');
      });
  }
}
