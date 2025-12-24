import { Property } from 'csstype';
import { Enumify } from '../utils/enumify';
import { proxiedPropertiesOf } from '../utils/proxied-properties-of';

export const JustifyContent =
  proxiedPropertiesOf<Enumify<Property.JustifyContent>>();
export const JustifyContentOptions = [
  JustifyContent.center,
  JustifyContent.start,
  JustifyContent.end,
  JustifyContent['space-around'],
  JustifyContent['space-between'],
  JustifyContent['space-evenly'],
];
