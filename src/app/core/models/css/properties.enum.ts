/* css enums */
import {Property} from "csstype";
import {Enumify} from "../../utils/enumify";
import {proxiedPropertiesOf} from "../../utils/proxied-properties-of";

export const FlexDirection = proxiedPropertiesOf<Enumify<Property.FlexDirection>>();
export const FlexWrap = proxiedPropertiesOf<Enumify<Property.FlexWrap>>();
export const JustifyContent = proxiedPropertiesOf<Enumify<Property.JustifyContent>>();
export const AlignItems = proxiedPropertiesOf<Enumify<Property.AlignItems>>();
export const AlignContent = proxiedPropertiesOf<Enumify<Property.AlignContent>>();
export const Display = proxiedPropertiesOf<Enumify<Property.Display>>();
export const AlignSelf = proxiedPropertiesOf<Enumify<Property.AlignSelf>>()
