import {BoxSizing} from "./box-sizing";
import {Display} from "./display";
import {FlexContainer} from "./flexContainer";
import {FlexItem} from "./flex-item";
import {GridContainer} from "./gridContainer";
import {GridItem} from "./grid-item";

export interface Css {
  boxSizing?: BoxSizing;
  display?: Display;
  flexContainer?: FlexContainer;
  flexItem?: FlexItem;
  gridContainer?: GridContainer;
  gridItem?: GridItem;
}

