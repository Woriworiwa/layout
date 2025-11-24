import { ThemeModel } from '../theme/theme.model';

export interface AppState {
  menuActive?: boolean;
  theme?: ThemeModel;
}
