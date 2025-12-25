import { Property } from 'csstype';
import { Enumify } from '../utils/enumify';
import { proxiedPropertiesOf } from '../utils/proxied-properties-of';

export const Display = proxiedPropertiesOf<Enumify<Property.Display>>();
export const DisplayOptions = [
  Display.block,
  Display.flex,
  Display.contents,
  Display.flow,
  Display.grid,
  Display.inline,
  Display.none,
];
