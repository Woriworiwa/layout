import {Property} from "csstype";

export const FlexDirection = proxiedPropertiesOf<Enumify<Property.FlexDirection>>();
export const FlexWrap = proxiedPropertiesOf<Enumify<Property.FlexWrap>>();

export enum FrameType {
  FLEX = 'FLEX',
  GRID = 'GRID',
  TEXT = 'TEXT',
}

type Enumify<T extends string | number | symbol> = {
  [K in T]: K;
};

export function proxiedPropertiesOf<TObj>(obj?: TObj) {
  return new Proxy({}, {
    get: (_, prop) => prop,
    set: () => {
      throw Error('Set not supported');
    },
  }) as {
    [P in keyof TObj]?: P;
  };
}
