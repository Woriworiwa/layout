import { Directive, ElementRef, HostListener, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective implements OnInit {
  private isResizing = false;
  private initialWidth = 0;
  private initialMouseX = 0;
  private iframe: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.iframe = this.el.nativeElement.parentElement?.querySelector('iframe') || null;

    if (this.el.nativeElement.classList.contains('left')) {
      this.renderer.setStyle(this.el.nativeElement, 'left', '0');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'ew-resize');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'right', '0');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'ew-resize');
    }
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

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isResizing = false;
  }
}
