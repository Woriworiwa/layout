/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
import type * as CSS from "csstype";

export interface FlexItem extends Pick<CSS.Properties,
  'flexGrow' |
  'flexShrink' |
  'flexBasis' |
  'alignSelf'
> {
}
