import type * as CSS from "csstype";

export interface Css {
  boxSizing?: BoxSizing;
  display?: Display;
  container?: Container;
  flex?: Flex;
}

/* Box sizing */
export interface BoxSizing extends Pick<CSS.Properties,
  'padding'
> {
}

/* Display */
export interface Display extends Pick<CSS.Properties,
  'display'
> {
}

/* Container */
export interface Container extends Pick<CSS.Properties,
  'justifyContent' |
  'alignItems' |
  'gap'
> {
}

/* Flex */
export interface Flex extends Container, Pick<CSS.Properties,
  'flexDirection' |
  'flexWrap'
> {
}


