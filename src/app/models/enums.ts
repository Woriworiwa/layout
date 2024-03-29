import {Property} from "csstype";
import {Enumify, proxiedPropertiesOf} from "../utils/enum.util";

export enum FrameType {
  FLEX = 'FLEX',
  GRID = 'GRID',
  TEXT = 'TEXT',
}

export const FlexDirection = proxiedPropertiesOf<Enumify<Property.FlexDirection>>();
export const FlexWrap = proxiedPropertiesOf<Enumify<Property.FlexWrap>>();
export const JustifyContent = proxiedPropertiesOf<Enumify<Property.JustifyContent>>();




