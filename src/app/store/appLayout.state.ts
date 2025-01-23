import {MainAreaContent, SideBarPrimary, SideBarSecondary} from "../models/enums";

export interface AppLayoutState {
  mainAreaContent?: MainAreaContent
  sideBarPrimary?: SideBarPrimary,
  sideBarSecondary?: SideBarSecondary,
}
