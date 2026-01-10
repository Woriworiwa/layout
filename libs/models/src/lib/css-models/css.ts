import { BoxSizing } from './box-sizing';
import { Container } from './container';
import { Layout } from './layout';
import { FlexItem } from './flex-item';
import { GridItem } from './grid-item';

export interface Css {
  boxSizing?: BoxSizing;
  display?: Layout;
  container?: Container;
  flexItem?: FlexItem;
  gridItem?: GridItem;
}
