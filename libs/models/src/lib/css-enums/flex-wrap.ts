import { Property } from 'csstype';
import { Enumify } from '../utils/enumify';
import { proxiedPropertiesOf } from '../utils/proxied-properties-of';

export const FlexWrap = proxiedPropertiesOf<Enumify<Property.FlexWrap>>();
export const FlexWrapOptions = [FlexWrap.wrap, FlexWrap.nowrap];
