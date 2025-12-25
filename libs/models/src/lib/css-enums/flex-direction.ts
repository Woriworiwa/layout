import { Property } from 'csstype';
import { Enumify } from '../utils/enumify';
import { proxiedPropertiesOf } from '../utils/proxied-properties-of';

export const FlexDirection =
  proxiedPropertiesOf<Enumify<Property.FlexDirection>>();
export const FlexDirectionOptions = [FlexDirection.row, FlexDirection.column];
