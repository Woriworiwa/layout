import { Property } from 'csstype';
import { Enumify } from '../utils/enumify';
import { proxiedPropertiesOf } from '../utils/proxied-properties-of';

export const JustifySelf = proxiedPropertiesOf<Enumify<Property.JustifySelf>>();
export const JustifySelfOptions = [
  JustifySelf.start,
  JustifySelf.end,
  JustifySelf.center,
  JustifySelf.stretch,
];
