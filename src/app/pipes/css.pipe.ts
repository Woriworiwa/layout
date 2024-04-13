import {Pipe, PipeTransform} from '@angular/core';
import {Css} from "../models/css-models/css.model";
import {SerializerService} from "../services/serializer.service";

@Pipe({
  standalone: true,
  name: 'css'
})
export class CssPipe implements PipeTransform {
  constructor(private serializerService: SerializerService) {
  }

  transform(value: Css | undefined): string {
    if (value == null) {
      return '';
    }

    return this.serializerService.serializeToCssStyles(value).join(';');
  }
}
