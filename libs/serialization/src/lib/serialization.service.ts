import { Injectable } from '@angular/core';
import { CssClassSerializer } from './serializers/css-class.serializer';
import { HtmlSerializer } from './serializers/html.serializer';
import { JSONSerializer } from './serializers/JSON.serializer';
import { CssStyleSerializer } from './serializers/css-style.serializer';
import { CssTailwindSerializer } from './serializers/css-tailwind.serializer';
import { SerializerType } from './types';

@Injectable()
export class SerializationService {
  getSerializer(serializerType: 'HTML'): HtmlSerializer;
  getSerializer(serializerType: 'JSON'): JSONSerializer;
  getSerializer(serializerType: 'CSS-class'): CssClassSerializer;
  getSerializer(serializerType: 'CSS-style'): CssStyleSerializer;
  getSerializer(serializerType: 'CSS-Tailwind'): CssTailwindSerializer;
  getSerializer(serializerType: SerializerType): HtmlSerializer | JSONSerializer | CssClassSerializer | CssStyleSerializer | CssTailwindSerializer;
  getSerializer(serializerType: SerializerType): HtmlSerializer | JSONSerializer | CssClassSerializer | CssStyleSerializer | CssTailwindSerializer {
    switch (serializerType) {
      case 'CSS-class':
        return new CssClassSerializer();
      case 'CSS-style':
        return new CssStyleSerializer();
      case 'HTML':
        return new HtmlSerializer();
      case 'JSON':
        return new JSONSerializer();
      case 'CSS-Tailwind':
        return new CssTailwindSerializer();
      default:
        throw new Error(`Unknown serializer type: ${serializerType}`);
    }
  }
}
