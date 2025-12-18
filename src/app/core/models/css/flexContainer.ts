import type * as CSS from "csstype";

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface FlexContainer extends Pick<CSS.Properties,
  'flexDirection' |
  'flexWrap'
> {
}
