/* Container */
/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
import type * as CSS from "csstype";

export interface Container extends Pick<CSS.Properties,
  'justifyContent' |
  'alignItems' |
  'alignContent' |
  'gap'
> {
}
