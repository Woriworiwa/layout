export interface FrameSettings {
  frameType: FrameType;
  stackLayoutSettings: StackLayoutSettings;
}

export interface StackLayoutSettings {
  direction: StackLayoutDirection;
}

export enum FrameType {
  STACK = 'STACK',
  GRID = 'GRID'
}

export enum StackLayoutDirection{
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL'
}
