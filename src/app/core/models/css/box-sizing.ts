/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
import type * as CSS from "csstype";

export interface BoxSizing extends Pick<CSS.Properties,
  'padding' |
  'height' |
  'width'
> {
}
