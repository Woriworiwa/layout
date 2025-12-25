import { Property } from 'csstype';
import { Enumify } from '../utils/enumify';
import { proxiedPropertiesOf } from '../utils/proxied-properties-of';

export const AlignSelf = proxiedPropertiesOf<Enumify<Property.AlignSelf>>();
export const AlignSelfOptions = [
  AlignSelf.start,
  AlignSelf.end,
  AlignSelf.center,
  AlignSelf.baseline,
  AlignSelf.stretch,
];
