import { Property } from 'csstype';
import { Enumify } from '../utils/enumify';
import { proxiedPropertiesOf } from '../utils/proxied-properties-of';

export const GridAutoFlow =
  proxiedPropertiesOf<Enumify<Property.GridAutoFlow>>();
export const GridAutoFlowOptions = [
  GridAutoFlow.row,
  GridAutoFlow.column,
  GridAutoFlow.dense,
];
