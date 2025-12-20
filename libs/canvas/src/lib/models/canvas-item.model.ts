import { CanvasItemType } from '../enums';
import { Css } from './css-interfaces/css';

export interface AiMetadata {
  prompt: string;
  isGenerating?: boolean;
  lastError?: string;
}

export interface CanvasItem {
  itemType: CanvasItemType;
  key?: string;
  label?: string;
  content?: string;
  children?: CanvasItem[];
  css?: Css;
  editable?: boolean;
  aiMetadata?: AiMetadata;
}
