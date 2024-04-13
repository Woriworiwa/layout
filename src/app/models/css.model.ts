import type * as CSS from "csstype";
import {Enumify, proxiedPropertiesOf} from "../utils/enum.util";
import {Property} from "csstype";

export interface Css {
  boxSizing?: BoxSizing;
  display?: Display;
  container?: Container;
  flex?: Flex;
}

/* Enums */
export const FlexDirection = proxiedPropertiesOf<Enumify<Property.FlexDirection>>();
export const FlexWrap = proxiedPropertiesOf<Enumify<Property.FlexWrap>>();
export const JustifyContent = proxiedPropertiesOf<Enumify<Property.JustifyContent>>();
export const AlignItems = proxiedPropertiesOf<Enumify<Property.AlignItems>>();
export const Display = proxiedPropertiesOf<Enumify<Property.Display>>();

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


