import type * as CSS from "csstype";

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface Container extends Pick<CSS.Properties,
  'justifyContent' |
  'alignItems' |
  'alignContent' |
  'gap'
> {
}
