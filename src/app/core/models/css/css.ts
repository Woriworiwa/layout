import {BoxSizing} from "./box-sizing";
import {Display} from "./display";
import {FlexContainer} from "./flexContainer";
import {FlexItem} from "./flex-item";

export interface Css {
  boxSizing?: BoxSizing;
  display?: Display;
  flexContainer?: FlexContainer;
  flexItem?: FlexItem;
}

