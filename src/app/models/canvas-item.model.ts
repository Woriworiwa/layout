import {FrameType} from "./enums";
import {FlexLayoutSettings} from "./css-models/flex-layout.model";
import {BoxSizing, Container, Css, Display, Flex} from "./css-models/css.model";

export interface CanvasItem {
  key?: string;
  name?: string;
  frameType: FrameType;
  children?: CanvasItem[];
  css?: Css;
  flexLayoutSettings?: FlexLayoutSettings;
  editable?: boolean;
}









