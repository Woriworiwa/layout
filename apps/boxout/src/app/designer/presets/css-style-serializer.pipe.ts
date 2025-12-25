import { Pipe, PipeTransform } from '@angular/core';
import { CssStyleSerializer } from '@layout/serialization';
import { CanvasItem } from '@layout/models';

@Pipe({
  standalone: true,
  name: 'cssStyleSerializer',
})
export class CssStyleSerializerPipe implements PipeTransform {
  transform(value: CanvasItem | undefined): string {
    if (value == null) {
      return '';
    }

    return new CssStyleSerializer().serialize([value]).join(';');
  }
}
