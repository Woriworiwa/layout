import { Injectable } from '@angular/core';
import { CssClassSerializer } from './serializers/css-class.serializer';
import { HtmlSerializer } from './serializers/html.serializer';
import { JSONSerializer } from './serializers/JSON.serializer';
import { CssStyleSerializer } from './serializers/css-style.serializer';

export type SerializerType = 'HTML' | 'JSON' | 'CSS-class' | 'CSS-style';

@Injectable()
export class SerializationService {
  getSerializer(serializerType: SerializerType) {
    switch (serializerType) {
      case 'CSS-class':
        return new CssClassSerializer();
      case 'CSS-style':
        return new CssStyleSerializer();
      case 'HTML':
        return new HtmlSerializer();
      case 'JSON':
        return new JSONSerializer();
    }
  }
}
