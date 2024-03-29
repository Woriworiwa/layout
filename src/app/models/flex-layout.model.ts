import type * as CSS from "csstype";

export interface Container extends
  Pick<CSS.Properties, 'gap'>{}

export interface FlexLayoutSettings extends
  Container,
  Pick<CSS.Properties,
    'flexDirection' |
    'flexWrap' |
    'gap' |
    'justifyContent'
  > {}
