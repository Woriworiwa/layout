import type * as CSS from "csstype";
import {Enumify, proxiedPropertiesOf} from "../../utils/enum.util";
import {Property} from "csstype";
import {Display} from "./css.model";

export interface FlexLayoutSettings extends
  Display, Pick<CSS.Properties,
    'flexDirection' |
    'flexWrap' |
    'justifyContent' |
    'alignItems' |
  'gap'
  > {}

/* Enums */
export const FlexDirection = proxiedPropertiesOf<Enumify<Property.FlexDirection>>();
export const FlexWrap = proxiedPropertiesOf<Enumify<Property.FlexWrap>>();
export const JustifyContent = proxiedPropertiesOf<Enumify<Property.JustifyContent>>();
export const AlignItems = proxiedPropertiesOf<Enumify<Property.AlignItems>>();
