import {Injectable} from "@angular/core";
import {CssClassSerializer} from "../data/serializers/css-class.serializer";
import {HtmlSerializer} from "../data/serializers/html.serializer";
import {JSONSerializer} from "../data/serializers/JSON.serializer";
import {CssStyleSerializer} from "../data/serializers/css-style.serializer";

@Injectable({
  providedIn: 'root'
})
export class SerializationService {
  getSerializer(serializerType: 'HTML' | 'JSON' | 'CSS-class' | 'CSS-style') {
    switch (serializerType) {
      case "CSS-class":
        return new CssClassSerializer();
      case "CSS-style":
        return new CssStyleSerializer();
      case "HTML":
        return new HtmlSerializer();
      case "JSON":
        return new JSONSerializer();
    }
  }
}
