import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-meta-label',
  imports: [],
  template: `<p>{{ label }}</p>`,
  styles: `
    :host {
      display: block;
      position: absolute;
      width: max-content;
      border-radius: 4px;
      font-size: 8px;

      p {
        line-height: 0;
        background: linear-gradient(
          to bottom,
          var(--bg-primary) 50%,
          var(--bg-secondary) 50%
        );
        border-radius: 2px;
        padding: 6px 3px;
        margin: 4px;
      }
    }
  `,
})
export class MetaLabelComponent implements OnChanges {
  private renderer = inject(Renderer2);
  protected elementRef = inject(ElementRef);

  @Input() label? = '';
  @Input() top = 0;
  @Input() left = 0;

  ngOnChanges() {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'left',
      `${this.left}px`,
    );
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'top',
      `${this.top - 10}px`,
    );
  }
}
