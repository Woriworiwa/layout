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
export const Gap = proxiedPropertiesOf<Enumify<Property.Gap>>();
export const Padding = proxiedPropertiesOf<Enumify<Property.Padding>>();
export const Height = proxiedPropertiesOf<Enumify<Property.Height>>();
export const Width = proxiedPropertiesOf<Enumify<Property.Width>>();
export const FlexGrow = proxiedPropertiesOf<Enumify<Property.FlexGrow>>();
export const FlexShrink = proxiedPropertiesOf<Enumify<Property.FlexShrink>>();
export const FlexBasis = proxiedPropertiesOf<Enumify<Property.FlexBasis>>();

// Grid properties
export const GridTemplateColumns = proxiedPropertiesOf<Enumify<Property.GridTemplateColumns>>();
export const GridTemplateRows = proxiedPropertiesOf<Enumify<Property.GridTemplateRows>>();
export const GridAutoFlow = proxiedPropertiesOf<Enumify<Property.GridAutoFlow>>();
export const GridAutoColumns = proxiedPropertiesOf<Enumify<Property.GridAutoColumns>>();
export const GridAutoRows = proxiedPropertiesOf<Enumify<Property.GridAutoRows>>();
export const GridColumn = proxiedPropertiesOf<Enumify<Property.GridColumn>>();
export const GridRow = proxiedPropertiesOf<Enumify<Property.GridRow>>();
export const JustifySelf = proxiedPropertiesOf<Enumify<Property.JustifySelf>>();
export const JustifyItems = proxiedPropertiesOf<Enumify<Property.JustifyItems>>();
export const PlaceItems = proxiedPropertiesOf<Enumify<Property.PlaceItems>>();
