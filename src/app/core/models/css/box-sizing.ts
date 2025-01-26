import type * as CSS from "csstype";

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface BoxSizing extends Pick<CSS.Properties,
  'padding' |
  'height' |
  'width'
> {
}
