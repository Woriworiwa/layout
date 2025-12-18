/* css enums */
import {Property} from "csstype";
import {Enumify} from "../../utils/enumify";
import {proxiedPropertiesOf} from "../../utils/proxied-properties-of";

export const Display = proxiedPropertiesOf<Enumify<Property.Display>>();
export const DisplayOptions = [
  Display.block,
  Display.flex,
  Display.contents,
  Display.flow,
  Display.grid,
  Display.inline,
  Display.none,
];

export const FlexDirection = proxiedPropertiesOf<Enumify<Property.FlexDirection>>();
export const FlexDirectionOptions = [
  FlexDirection.row,
  FlexDirection.column
]

export const FlexWrap = proxiedPropertiesOf<Enumify<Property.FlexWrap>>();
export const FlexWrapOptions = [
  FlexWrap.wrap,
  FlexWrap.nowrap
]

export const JustifyContent = proxiedPropertiesOf<Enumify<Property.JustifyContent>>();
export const JustifyContentOptions = [
  JustifyContent.center,
  JustifyContent.start,
  JustifyContent.end,
  JustifyContent['space-around'],
  JustifyContent['space-between'],
  JustifyContent['space-evenly'],
];

export const AlignItems = proxiedPropertiesOf<Enumify<Property.AlignItems>>();
export const AlignItemsOptions = [
  AlignItems.start,
  AlignItems.end,
  AlignItems.center,
  AlignItems.stretch,
  AlignItems.baseline,
];

export const AlignContent = proxiedPropertiesOf<Enumify<Property.AlignContent>>();
export const AlignContentOptions = [
  AlignContent.start,
  AlignContent.end,
  AlignContent.center,
  AlignContent.stretch,
  AlignContent['space-between'],
  AlignContent['space-around'],
  AlignContent['space-evenly'],
  AlignContent.baseline,
];

export const AlignSelf = proxiedPropertiesOf<Enumify<Property.AlignSelf>>()
export const AlignSelfOptions = [
  AlignSelf.start,
  AlignSelf.end,
  AlignSelf.center,
  AlignSelf.baseline,
  AlignSelf.stretch,
];

export const GridAutoFlow = proxiedPropertiesOf<Enumify<Property.GridAutoFlow>>();
export const GridAutoFlowOptions = [
  GridAutoFlow.row,
  GridAutoFlow.column,
  GridAutoFlow.dense
];

export const JustifySelf = proxiedPropertiesOf<Enumify<Property.JustifySelf>>();
export const JustifySelfOptions = [
  JustifySelf.start,
  JustifySelf.end,
  JustifySelf.center,
  JustifySelf.stretch,
];

export const JustifyItems = proxiedPropertiesOf<Enumify<Property.JustifyItems>>();
export const JustifyItemsOptions = [
  JustifyItems.start,
  JustifyItems.end,
  JustifyItems.center,
  JustifyItems.stretch,
];

export const PlaceItems = proxiedPropertiesOf<Enumify<Property.PlaceItems>>();
