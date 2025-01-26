/* Flex */
/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
import {Container} from "./container";
import type * as CSS from "csstype";

export interface FlexContainer extends Container, Pick<CSS.Properties,
  'flexDirection' |
  'flexWrap'
> {
}
