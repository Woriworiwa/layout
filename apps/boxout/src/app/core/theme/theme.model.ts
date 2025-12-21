export interface ThemeModel {
  preset: string;
  primary: string;
  surface: string | undefined;
  darkMode: boolean;
  ripple: boolean;
}

export interface ColorOption {
  name: string;
  palette: Record<string, string>;
}

export interface PresetOption {
  name: string;
  value: string;
}
