import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HtmlSerializer} from "../../data/serializers/html.serializer";
import {CanvasStore} from "../../store/canvas.store";
import {UnsafeHtmlPipe} from "../../pipes/unsafe-html.pipe";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CanvasItem} from "../../models/canvas-item.model";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-preview',
  standalone: true,
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

    <div style="overflow: auto; flex-grow: 1; display: flex; flex-direction: column">
      <iframe [srcdoc]="code | unsafeHtml"
              [ngStyle]="{ 'width': selectedMediaQuery?.width, 'flex-grow': 1}"></iframe>
    </div>
  `,
  styles: `
    :host {
      background-color: #eeeeee;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    iframe {
      border: none;
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
    width: 'auto',
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
  protected selectedMediaQuery: { name: string, width: string } | undefined = this.mediaQueries[this.mediaQueries.findIndex((mq: { name: string, width: string }) => mq.name === 'auto')];

  constructor(private canvasStore: CanvasStore) {
    this.canvasStore.frames$
      .pipe(takeUntilDestroyed())
      .subscribe((items: CanvasItem[]) => {
        this.code = this.serializer.serialize(items).join('\n');
      });
  }
}
