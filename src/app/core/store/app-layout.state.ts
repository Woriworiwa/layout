import { MainAreaContent, SideBarPrimary, SideBarSecondary } from '../enums';

export interface AppLayoutState {
  mainAreaContent?: MainAreaContent;
  sideBarPrimary?: SideBarPrimary;
  sideBarSecondary?: SideBarSecondary;
}
