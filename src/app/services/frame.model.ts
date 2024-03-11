export interface FrameSettings {
  frameType: FrameType;
  flexLayoutSettings: FlexLayoutSettings;
}

export interface FlexLayoutSettings {
  flexDirection: FlexDirection;
  flexWrap: boolean;
}

export enum FrameType {
  FLEX = 'FLEX',
  GRID = 'GRID'
}

export enum FlexDirection{
  ROW = 'row',
  COLUMN = 'column'
}
