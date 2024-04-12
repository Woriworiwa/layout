import type * as CSS from 'csstype';
import {Property} from "csstype";
import {FrameType} from "./enums";
import {FlexLayoutSettings} from "./css-models/flex-layout.model";

export interface Frame {
  key?: string;
  name?: string;
  frameType: FrameType;
  children?: Frame[];
  flexLayoutSettings?: FlexLayoutSettings;
  editable?: boolean;
}









