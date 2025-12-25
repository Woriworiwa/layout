// converts a type to an enum
export type Enumify<T extends string | number | symbol> = {
  [K in T]: K;
};
