import { CanvasItem } from '@layout/models';

export abstract class Serializer<TOptions = void> {
  private readonly paddingCharacter = ' ';

  public abstract serialize(items: CanvasItem[], options?: TOptions): string[];

  protected indent(value: string, depth = 0): string {
    return this.paddingCharacter.repeat(depth * 2) + value;
  }
}
