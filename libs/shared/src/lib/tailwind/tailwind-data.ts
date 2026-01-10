import tailwindClasses from './tailwind-classes.json';

export interface TailwindClass {
  label: string;
  detail: string;
  type: 'class' | 'variant';
}

export interface TailwindData {
  utilities: TailwindClass[];
  variants: TailwindClass[];
}

export const TAILWIND_DATA = tailwindClasses as TailwindData;
