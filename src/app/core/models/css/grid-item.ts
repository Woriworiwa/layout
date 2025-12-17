import type * as CSS from "csstype";

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface GridItem extends Pick<CSS.Properties,
  'gridColumn' |
  'gridRow' |
  'gridColumnStart' |
  'gridColumnEnd' |
  'gridRowStart' |
  'gridRowEnd' |
  'justifySelf' |
  'alignSelf'
> {
}
