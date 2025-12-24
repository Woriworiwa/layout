import { Property } from 'csstype';
import { Enumify } from '../utils/enumify';
import { proxiedPropertiesOf } from '../utils/proxied-properties-of';

export const AlignItems = proxiedPropertiesOf<Enumify<Property.AlignItems>>();
export const AlignItemsOptions = [
  AlignItems.start,
  AlignItems.end,
  AlignItems.center,
  AlignItems.stretch,
  AlignItems.baseline,
];
