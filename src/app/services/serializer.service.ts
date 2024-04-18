import {Injectable} from "@angular/core";
import {CanvasStore} from "../store/canvas.store";
import {Serializer} from "../data/serializers/serializer";
import {CssClassSerializer} from "../data/serializers/css-class.serializer";

@Injectable({
  providedIn: 'root'
})
export class SerializerService {
  constructor(private canvasStore: CanvasStore) {
  }

  factoryCss() {
    const serializer: Serializer = new CssClassSerializer();
    return serializer.serialize([]);
  }
}
