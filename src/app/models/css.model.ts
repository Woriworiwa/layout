import type * as CSS from "csstype";
import {Enumify, proxiedPropertiesOf} from "../utils/enum.util";
import {Property} from "csstype";

export interface Css {
  boxSizing?: BoxSizing;
  display?: Display;
  flexContainer?: FlexContainer;
  flexItem?: FlexItem;
}

/* these properties must be post-fixed with a unit. For now, the unit is px.
* TODO: make the unit configurable per control */
export const POSTFIXED_PROPERTIES = ['gap', 'padding', 'height', 'width'];

export const POSTFIX_UNIT = 'px';

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
  'height' |
  'width'
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
export interface FlexContainer extends Container, Pick<CSS.Properties,
  'flexDirection' |
  'flexWrap'
> {
}

export interface FlexItem extends Pick<CSS.Properties,
  'flexGrow' |
  'flexShrink' |
  'flexBasis' |
  'alignSelf'
> {
  }
