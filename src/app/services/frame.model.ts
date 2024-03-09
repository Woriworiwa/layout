export interface FrameSettings {
  frameType: FrameType;
  flexLayoutSettings: FlexLayoutSettings;
}

export interface FlexLayoutSettings {
  flexDirection: FlexDirection;
}

export enum FrameType {
  STACK = 'STACK',
  GRID = 'GRID'
}

export enum FlexDirection{
  ROW = 'row',
  COLUMN = 'column'
}
