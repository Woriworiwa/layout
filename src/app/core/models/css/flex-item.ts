import type * as CSS from "csstype";

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface FlexItem extends Pick<CSS.Properties,
  'flexGrow' |
  'flexShrink' |
  'flexBasis' |
  'alignSelf'
> {
}
