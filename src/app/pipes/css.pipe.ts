import {Pipe, PipeTransform} from '@angular/core';
import {CssStyleSerializer} from "../data/serializers/css-style.serializer";
import {CanvasItem} from "../models/canvas-item.model";

@Pipe({
  standalone: true,
  name: 'css'
})
export class CssPipe implements PipeTransform {
  constructor() {
  }

  transform(value: CanvasItem | undefined): string {
    if (value == null) {
      return '';
    }

    return new CssStyleSerializer().serialize([value]).join(';');
  }
}
