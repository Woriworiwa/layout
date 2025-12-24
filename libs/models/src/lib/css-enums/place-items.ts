import { Property } from 'csstype';
import { Enumify } from '../utils/enumify';
import { proxiedPropertiesOf } from '../utils/proxied-properties-of';

export const PlaceItems = proxiedPropertiesOf<Enumify<Property.PlaceItems>>();
