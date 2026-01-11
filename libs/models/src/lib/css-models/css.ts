import { Spacing } from './spacing';
import { Sizing } from './sizing';
import { Container } from './container';
import { Layout } from './layout';

export interface Css {
  spacing?: Spacing;
  sizing?: Sizing;
  display?: Layout;
  container?: Container;
}
