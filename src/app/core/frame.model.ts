import type * as CSS from 'csstype';
import {Property} from "csstype";
import {FrameType} from "./enums";

export interface Frame {
  key?: string;
  name?: string;
  frameType: FrameType;
  children: Frame[];
  flexLayoutSettings?: FlexLayoutSettings;
  editable?: boolean;
}

export interface Container extends
  Pick<CSS.Properties, 'gap'>{}

export interface FlexLayoutSettings extends
    Container,
    Pick<CSS.Properties, 'flexDirection' | 'flexWrap' | 'gap'> {}





