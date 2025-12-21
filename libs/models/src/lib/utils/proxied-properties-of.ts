// uses proxy to extract property names from the object
// https://stackoverflow.com/questions/33547583/safe-way-to-extract-property-names
export function proxiedPropertiesOf<TObj>(_o?: TObj) {
  return new Proxy(
    {},
    {
      get: (_, prop) => prop,
      set: () => {
        throw Error('Set not supported');
      },
    },
  ) as {
    [P in keyof TObj]?: P;
  };
}
