import { Spacing } from './spacing';
import { Sizing } from './sizing';
import { FlexboxGrid } from './flexbox-grid';
import { Layout } from './layout';

export interface Css {
  spacing?: Spacing;
  sizing?: Sizing;
  display?: Layout;
  flexboxGrid?: FlexboxGrid;
}
