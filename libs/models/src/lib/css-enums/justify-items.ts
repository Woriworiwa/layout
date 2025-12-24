import { Property } from 'csstype';
import { Enumify } from '../utils/enumify';
import { proxiedPropertiesOf } from '../utils/proxied-properties-of';

export const JustifyItems =
  proxiedPropertiesOf<Enumify<Property.JustifyItems>>();
export const JustifyItemsOptions = [
  JustifyItems.start,
  JustifyItems.end,
  JustifyItems.center,
  JustifyItems.stretch,
];
