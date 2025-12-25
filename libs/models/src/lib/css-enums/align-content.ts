import { Property } from 'csstype';
import { Enumify } from '../utils/enumify';
import { proxiedPropertiesOf } from '../utils/proxied-properties-of';

export const AlignContent =
  proxiedPropertiesOf<Enumify<Property.AlignContent>>();
export const AlignContentOptions = [
  AlignContent.start,
  AlignContent.end,
  AlignContent.center,
  AlignContent.stretch,
  AlignContent['space-between'],
  AlignContent['space-around'],
  AlignContent['space-evenly'],
  AlignContent.baseline,
];
