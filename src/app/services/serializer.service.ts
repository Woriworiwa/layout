import {Injectable} from "@angular/core";
import {CanvasStore} from "../store/canvas.store";

@Injectable({
  providedIn: 'root'
})
export class SerializerService {
  serializerActive = false;

  constructor(private canvasStore: CanvasStore) {

  }

  showSerializer() {
    this.serializerActive = true;
  }

  hideSerializer() {
    this.serializerActive = false;
  }

  serializeToJSON() {
    // for now, just return the object and we will stringify it later using the JSON pipe
    return this.canvasStore.getState().rootFrame;
  }

  serializeToCSS() {

  }
}
