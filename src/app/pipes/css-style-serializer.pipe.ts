import {Pipe, PipeTransform} from '@angular/core';
import {CssStyleSerializer} from "../data/serializers/css-style.serializer";
import {CanvasItem} from "../models/canvas-item.model";

@Pipe({
  standalone: true,
  name: 'cssStyleSerializer'
})
export class CssStyleSerializerPipe implements PipeTransform {
  transform(value: CanvasItem | undefined): string {
    if (value == null) {
      return '';
    }

    return new CssStyleSerializer().serialize([value]).join(';');
  }
}
