import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'unsafeHtml',
  standalone: true,
})
export class UnsafeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(v: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(v);
  }
}
