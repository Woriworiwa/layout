import { BoxSizing } from './box-sizing';
import { Container } from './container';
import { Layout } from './layout';
import { FlexContainer } from './flexContainer';
import { FlexItem } from './flex-item';
import { GridContainer } from './gridContainer';
import { GridItem } from './grid-item';

export interface Css {
  boxSizing?: BoxSizing;
  display?: Layout;
  container?: Container;
  flexContainer?: FlexContainer;
  flexItem?: FlexItem;
  gridContainer?: GridContainer;
  gridItem?: GridItem;
}
