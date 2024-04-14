import type * as CSS from "csstype";
import {Enumify, proxiedPropertiesOf} from "../utils/enum.util";
import {Property} from "csstype";

export interface Css {
  boxSizing?: BoxSizing;
  display?: Display;
  container?: Container;
  flex?: Flex;
}

/* these properties must be prefixes with a unit. For now, the unit is px.
* TODO: make the unit configurable per control */
export const POSTFIXED_PROPERTIES = ['gap', 'padding', 'height'];

/* Enums */
export const FlexDirection = proxiedPropertiesOf<Enumify<Property.FlexDirection>>();
export const FlexWrap = proxiedPropertiesOf<Enumify<Property.FlexWrap>>();
export const JustifyContent = proxiedPropertiesOf<Enumify<Property.JustifyContent>>();
export const AlignItems = proxiedPropertiesOf<Enumify<Property.AlignItems>>();
export const AlignContent = proxiedPropertiesOf<Enumify<Property.AlignContent>>();
export const Display = proxiedPropertiesOf<Enumify<Property.Display>>();

/* Box sizing */
export interface BoxSizing extends Pick<CSS.Properties,
  'padding' |
  'height'
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
  'alignContent' |
  'gap'
> {
}

/* Flex */
export interface Flex extends Container, Pick<CSS.Properties,
  'flexDirection' |
  'flexWrap'
> {
}
