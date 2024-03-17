export interface Frame {
  key: string;
  name?: string;
  frameType: FrameType;
  children: Frame[];
  layoutSettings?: FlexLayoutSettings | GridLayoutSettings;
  flexLayoutSettings?: FlexLayoutSettings;
  gridLayoutSettings?: GridLayoutSettings;
}

export interface LayoutSettings {

}

export interface FlexLayoutSettings extends LayoutSettings {
  flexDirection?: FlexDirection;
  flexWrap?: FlexWrap;
  gap?: number;
}

export interface GridLayoutSettings extends LayoutSettings {

}

export enum FrameType {
  FLEX = 'FLEX',
  GRID = 'GRID'
}

export enum FlexDirection {
  ROW = 'row',
  COLUMN = 'column'
}

export enum FlexWrap {
  WRAP = 'wrap',
  NOWRAP = 'nowrap'
}
