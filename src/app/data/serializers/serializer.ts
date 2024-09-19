import {CanvasItem} from "../../models/canvas-item.model";

export abstract class Serializer {
  private readonly paddingCharacter = ' ';

  public abstract serialize(items: CanvasItem[]): string[];

  protected indent(value: string, depth = 0): string {
    return this.paddingCharacter.repeat(depth * 2) + value;
  }
}
