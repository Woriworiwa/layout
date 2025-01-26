import {Pipe, PipeTransform} from '@angular/core';
import {CssStyleSerializer} from "../../serialization/serializers/css-style.serializer";
import {CanvasItem} from "../../core/models/canvas-item.model";

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
