import type * as CSS from "csstype";
import {Enumify, proxiedPropertiesOf} from "../../utils/enum.util";
import {Property} from "csstype";

export interface Element extends
  Pick<CSS.Properties, 'padding'>{}

export interface Container extends Element,
  Pick<CSS.Properties, 'gap'>{}

export interface FlexLayoutSettings extends
  Container, Pick<CSS.Properties,
    'flexDirection' |
    'flexWrap' |
    'gap' |
    'justifyContent' |
    'alignItems'
  > {}

/* Enums */
export const FlexDirection = proxiedPropertiesOf<Enumify<Property.FlexDirection>>();
export const FlexWrap = proxiedPropertiesOf<Enumify<Property.FlexWrap>>();
export const JustifyContent = proxiedPropertiesOf<Enumify<Property.JustifyContent>>();
export const AlignItems = proxiedPropertiesOf<Enumify<Property.AlignItems>>();
