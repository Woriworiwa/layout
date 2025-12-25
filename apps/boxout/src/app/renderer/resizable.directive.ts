import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  OnInit,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appResizable]',
})
export class ResizableDirective implements OnInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  private isResizing = false;
  private initialWidth = 0;
  private initialMouseX = 0;
  private iframe: HTMLElement | null = null;

  ngOnInit() {
    // Find the iframe in the parent element
    this.iframe =
      this.el.nativeElement.parentElement?.querySelector('iframe') || null;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isResizing = true;
    this.initialWidth = this.iframe?.offsetWidth || 0;
    this.initialMouseX = event.clientX;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing && this.iframe) {
      let newWidth = this.initialWidth + event.clientX - this.initialMouseX;
      if (this.el.nativeElement.classList.contains('left')) {
        newWidth = this.initialWidth - (event.clientX - this.initialMouseX);
      }
      this.iframe.style.width = `${newWidth}px`;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
  }
}
