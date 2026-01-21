import { Css } from '@layout/models';

/**
 * Mapping from a Tailwind class to its corresponding CSS model property.
 */
export interface TailwindToCssMapping {
  /** The category in the Css interface (layout, spacing, sizing, flexboxGrid) */
  category: keyof Css;
  /** The property name within the category (camelCase) */
  property: string;
  /** The CSS value to set */
  value: string | number;
}

/**
 * CSS property to Tailwind prefix mapping for arbitrary values.
 * Used to parse classes like `gap-[17px]` back to CSS.
 */
export const CSS_PROPERTY_TO_TAILWIND_PREFIX: Record<string, { category: keyof Css; property: string }> = {
  // Spacing
  'p': { category: 'spacing', property: 'padding' },
  'm': { category: 'spacing', property: 'margin' },

  // Sizing
  'w': { category: 'sizing', property: 'width' },
  'h': { category: 'sizing', property: 'height' },

  // FlexboxGrid
  'gap': { category: 'flexboxGrid', property: 'gap' },
  'justify': { category: 'flexboxGrid', property: 'justifyContent' },
  'items': { category: 'flexboxGrid', property: 'alignItems' },
  'content': { category: 'flexboxGrid', property: 'alignContent' },
  'self': { category: 'flexboxGrid', property: 'alignSelf' },
  'justify-self': { category: 'flexboxGrid', property: 'justifySelf' },
  'justify-items': { category: 'flexboxGrid', property: 'justifyItems' },
  'grow': { category: 'flexboxGrid', property: 'flexGrow' },
  'shrink': { category: 'flexboxGrid', property: 'flexShrink' },
  'basis': { category: 'flexboxGrid', property: 'flexBasis' },
  'grid-cols': { category: 'flexboxGrid', property: 'gridTemplateColumns' },
  'grid-rows': { category: 'flexboxGrid', property: 'gridTemplateRows' },
  'col': { category: 'flexboxGrid', property: 'gridColumn' },
  'row': { category: 'flexboxGrid', property: 'gridRow' },
  'col-start': { category: 'flexboxGrid', property: 'gridColumnStart' },
  'col-end': { category: 'flexboxGrid', property: 'gridColumnEnd' },
  'row-start': { category: 'flexboxGrid', property: 'gridRowStart' },
  'row-end': { category: 'flexboxGrid', property: 'gridRowEnd' },
  'grid-flow': { category: 'flexboxGrid', property: 'gridAutoFlow' },
  'auto-cols': { category: 'flexboxGrid', property: 'gridAutoColumns' },
  'auto-rows': { category: 'flexboxGrid', property: 'gridAutoRows' },
};

/**
 * Mapping from Tailwind utility classes to CSS model properties.
 * Only includes classes that map to properties in our Css interface.
 *
 * Note: Directional classes (px-*, py-*, pt-*, etc.) and responsive variants
 * (md:*, lg:*, etc.) are NOT included as they don't map 1:1 to our CSS model.
 */
export const TAILWIND_TO_CSS_MAP: Record<string, TailwindToCssMapping> = {
  // ============================================
  // DISPLAY (layout.display)
  // ============================================
  'block': { category: 'layout', property: 'display', value: 'block' },
  'inline-block': { category: 'layout', property: 'display', value: 'inline-block' },
  'inline': { category: 'layout', property: 'display', value: 'inline' },
  'flex': { category: 'layout', property: 'display', value: 'flex' },
  'inline-flex': { category: 'layout', property: 'display', value: 'inline-flex' },
  'grid': { category: 'layout', property: 'display', value: 'grid' },
  'inline-grid': { category: 'layout', property: 'display', value: 'inline-grid' },
  'contents': { category: 'layout', property: 'display', value: 'contents' },
  'flow-root': { category: 'layout', property: 'display', value: 'flow-root' },
  'hidden': { category: 'layout', property: 'display', value: 'none' },

  // ============================================
  // PADDING (spacing.padding) - shorthand only
  // ============================================
  'p-0': { category: 'spacing', property: 'padding', value: '0rem' },
  'p-0.5': { category: 'spacing', property: 'padding', value: '0.125rem' },
  'p-1': { category: 'spacing', property: 'padding', value: '0.25rem' },
  'p-1.5': { category: 'spacing', property: 'padding', value: '0.375rem' },
  'p-2': { category: 'spacing', property: 'padding', value: '0.5rem' },
  'p-2.5': { category: 'spacing', property: 'padding', value: '0.625rem' },
  'p-3': { category: 'spacing', property: 'padding', value: '0.75rem' },
  'p-3.5': { category: 'spacing', property: 'padding', value: '0.875rem' },
  'p-4': { category: 'spacing', property: 'padding', value: '1rem' },
  'p-5': { category: 'spacing', property: 'padding', value: '1.25rem' },
  'p-6': { category: 'spacing', property: 'padding', value: '1.5rem' },
  'p-7': { category: 'spacing', property: 'padding', value: '1.75rem' },
  'p-8': { category: 'spacing', property: 'padding', value: '2rem' },
  'p-9': { category: 'spacing', property: 'padding', value: '2.25rem' },
  'p-10': { category: 'spacing', property: 'padding', value: '2.5rem' },
  'p-11': { category: 'spacing', property: 'padding', value: '2.75rem' },
  'p-12': { category: 'spacing', property: 'padding', value: '3rem' },
  'p-14': { category: 'spacing', property: 'padding', value: '3.5rem' },
  'p-16': { category: 'spacing', property: 'padding', value: '4rem' },
  'p-20': { category: 'spacing', property: 'padding', value: '5rem' },
  'p-24': { category: 'spacing', property: 'padding', value: '6rem' },
  'p-28': { category: 'spacing', property: 'padding', value: '7rem' },
  'p-32': { category: 'spacing', property: 'padding', value: '8rem' },
  'p-36': { category: 'spacing', property: 'padding', value: '9rem' },
  'p-40': { category: 'spacing', property: 'padding', value: '10rem' },
  'p-44': { category: 'spacing', property: 'padding', value: '11rem' },
  'p-48': { category: 'spacing', property: 'padding', value: '12rem' },
  'p-52': { category: 'spacing', property: 'padding', value: '13rem' },
  'p-56': { category: 'spacing', property: 'padding', value: '14rem' },
  'p-60': { category: 'spacing', property: 'padding', value: '15rem' },
  'p-64': { category: 'spacing', property: 'padding', value: '16rem' },
  'p-72': { category: 'spacing', property: 'padding', value: '18rem' },
  'p-80': { category: 'spacing', property: 'padding', value: '20rem' },
  'p-96': { category: 'spacing', property: 'padding', value: '24rem' },
  'p-px': { category: 'spacing', property: 'padding', value: '1px' },

  // ============================================
  // MARGIN (spacing.margin) - shorthand only
  // ============================================
  'm-0': { category: 'spacing', property: 'margin', value: '0rem' },
  'm-0.5': { category: 'spacing', property: 'margin', value: '0.125rem' },
  'm-1': { category: 'spacing', property: 'margin', value: '0.25rem' },
  'm-1.5': { category: 'spacing', property: 'margin', value: '0.375rem' },
  'm-2': { category: 'spacing', property: 'margin', value: '0.5rem' },
  'm-2.5': { category: 'spacing', property: 'margin', value: '0.625rem' },
  'm-3': { category: 'spacing', property: 'margin', value: '0.75rem' },
  'm-3.5': { category: 'spacing', property: 'margin', value: '0.875rem' },
  'm-4': { category: 'spacing', property: 'margin', value: '1rem' },
  'm-5': { category: 'spacing', property: 'margin', value: '1.25rem' },
  'm-6': { category: 'spacing', property: 'margin', value: '1.5rem' },
  'm-7': { category: 'spacing', property: 'margin', value: '1.75rem' },
  'm-8': { category: 'spacing', property: 'margin', value: '2rem' },
  'm-9': { category: 'spacing', property: 'margin', value: '2.25rem' },
  'm-10': { category: 'spacing', property: 'margin', value: '2.5rem' },
  'm-11': { category: 'spacing', property: 'margin', value: '2.75rem' },
  'm-12': { category: 'spacing', property: 'margin', value: '3rem' },
  'm-14': { category: 'spacing', property: 'margin', value: '3.5rem' },
  'm-16': { category: 'spacing', property: 'margin', value: '4rem' },
  'm-20': { category: 'spacing', property: 'margin', value: '5rem' },
  'm-24': { category: 'spacing', property: 'margin', value: '6rem' },
  'm-auto': { category: 'spacing', property: 'margin', value: 'auto' },
  'm-px': { category: 'spacing', property: 'margin', value: '1px' },

  // ============================================
  // WIDTH (sizing.width)
  // ============================================
  'w-0': { category: 'sizing', property: 'width', value: '0' },
  'w-px': { category: 'sizing', property: 'width', value: '1px' },
  'w-0.5': { category: 'sizing', property: 'width', value: '0.125rem' },
  'w-1': { category: 'sizing', property: 'width', value: '0.25rem' },
  'w-1.5': { category: 'sizing', property: 'width', value: '0.375rem' },
  'w-2': { category: 'sizing', property: 'width', value: '0.5rem' },
  'w-2.5': { category: 'sizing', property: 'width', value: '0.625rem' },
  'w-3': { category: 'sizing', property: 'width', value: '0.75rem' },
  'w-3.5': { category: 'sizing', property: 'width', value: '0.875rem' },
  'w-4': { category: 'sizing', property: 'width', value: '1rem' },
  'w-5': { category: 'sizing', property: 'width', value: '1.25rem' },
  'w-6': { category: 'sizing', property: 'width', value: '1.5rem' },
  'w-7': { category: 'sizing', property: 'width', value: '1.75rem' },
  'w-8': { category: 'sizing', property: 'width', value: '2rem' },
  'w-9': { category: 'sizing', property: 'width', value: '2.25rem' },
  'w-10': { category: 'sizing', property: 'width', value: '2.5rem' },
  'w-11': { category: 'sizing', property: 'width', value: '2.75rem' },
  'w-12': { category: 'sizing', property: 'width', value: '3rem' },
  'w-14': { category: 'sizing', property: 'width', value: '3.5rem' },
  'w-16': { category: 'sizing', property: 'width', value: '4rem' },
  'w-20': { category: 'sizing', property: 'width', value: '5rem' },
  'w-24': { category: 'sizing', property: 'width', value: '6rem' },
  'w-28': { category: 'sizing', property: 'width', value: '7rem' },
  'w-32': { category: 'sizing', property: 'width', value: '8rem' },
  'w-36': { category: 'sizing', property: 'width', value: '9rem' },
  'w-40': { category: 'sizing', property: 'width', value: '10rem' },
  'w-44': { category: 'sizing', property: 'width', value: '11rem' },
  'w-48': { category: 'sizing', property: 'width', value: '12rem' },
  'w-52': { category: 'sizing', property: 'width', value: '13rem' },
  'w-56': { category: 'sizing', property: 'width', value: '14rem' },
  'w-60': { category: 'sizing', property: 'width', value: '15rem' },
  'w-64': { category: 'sizing', property: 'width', value: '16rem' },
  'w-72': { category: 'sizing', property: 'width', value: '18rem' },
  'w-80': { category: 'sizing', property: 'width', value: '20rem' },
  'w-96': { category: 'sizing', property: 'width', value: '24rem' },
  'w-auto': { category: 'sizing', property: 'width', value: 'auto' },
  'w-full': { category: 'sizing', property: 'width', value: '100%' },
  'w-screen': { category: 'sizing', property: 'width', value: '100vw' },
  'w-min': { category: 'sizing', property: 'width', value: 'min-content' },
  'w-max': { category: 'sizing', property: 'width', value: 'max-content' },
  'w-fit': { category: 'sizing', property: 'width', value: 'fit-content' },
  'w-1/2': { category: 'sizing', property: 'width', value: '50%' },
  'w-1/3': { category: 'sizing', property: 'width', value: '33.333333%' },
  'w-2/3': { category: 'sizing', property: 'width', value: '66.666667%' },
  'w-1/4': { category: 'sizing', property: 'width', value: '25%' },
  'w-2/4': { category: 'sizing', property: 'width', value: '50%' },
  'w-3/4': { category: 'sizing', property: 'width', value: '75%' },
  'w-1/5': { category: 'sizing', property: 'width', value: '20%' },
  'w-2/5': { category: 'sizing', property: 'width', value: '40%' },
  'w-3/5': { category: 'sizing', property: 'width', value: '60%' },
  'w-4/5': { category: 'sizing', property: 'width', value: '80%' },
  'w-1/6': { category: 'sizing', property: 'width', value: '16.666667%' },
  'w-5/6': { category: 'sizing', property: 'width', value: '83.333333%' },

  // ============================================
  // HEIGHT (sizing.height)
  // ============================================
  'h-0': { category: 'sizing', property: 'height', value: '0' },
  'h-px': { category: 'sizing', property: 'height', value: '1px' },
  'h-0.5': { category: 'sizing', property: 'height', value: '0.125rem' },
  'h-1': { category: 'sizing', property: 'height', value: '0.25rem' },
  'h-1.5': { category: 'sizing', property: 'height', value: '0.375rem' },
  'h-2': { category: 'sizing', property: 'height', value: '0.5rem' },
  'h-2.5': { category: 'sizing', property: 'height', value: '0.625rem' },
  'h-3': { category: 'sizing', property: 'height', value: '0.75rem' },
  'h-3.5': { category: 'sizing', property: 'height', value: '0.875rem' },
  'h-4': { category: 'sizing', property: 'height', value: '1rem' },
  'h-5': { category: 'sizing', property: 'height', value: '1.25rem' },
  'h-6': { category: 'sizing', property: 'height', value: '1.5rem' },
  'h-7': { category: 'sizing', property: 'height', value: '1.75rem' },
  'h-8': { category: 'sizing', property: 'height', value: '2rem' },
  'h-9': { category: 'sizing', property: 'height', value: '2.25rem' },
  'h-10': { category: 'sizing', property: 'height', value: '2.5rem' },
  'h-11': { category: 'sizing', property: 'height', value: '2.75rem' },
  'h-12': { category: 'sizing', property: 'height', value: '3rem' },
  'h-14': { category: 'sizing', property: 'height', value: '3.5rem' },
  'h-16': { category: 'sizing', property: 'height', value: '4rem' },
  'h-20': { category: 'sizing', property: 'height', value: '5rem' },
  'h-24': { category: 'sizing', property: 'height', value: '6rem' },
  'h-28': { category: 'sizing', property: 'height', value: '7rem' },
  'h-32': { category: 'sizing', property: 'height', value: '8rem' },
  'h-36': { category: 'sizing', property: 'height', value: '9rem' },
  'h-40': { category: 'sizing', property: 'height', value: '10rem' },
  'h-44': { category: 'sizing', property: 'height', value: '11rem' },
  'h-48': { category: 'sizing', property: 'height', value: '12rem' },
  'h-52': { category: 'sizing', property: 'height', value: '13rem' },
  'h-56': { category: 'sizing', property: 'height', value: '14rem' },
  'h-60': { category: 'sizing', property: 'height', value: '15rem' },
  'h-64': { category: 'sizing', property: 'height', value: '16rem' },
  'h-72': { category: 'sizing', property: 'height', value: '18rem' },
  'h-80': { category: 'sizing', property: 'height', value: '20rem' },
  'h-96': { category: 'sizing', property: 'height', value: '24rem' },
  'h-auto': { category: 'sizing', property: 'height', value: 'auto' },
  'h-full': { category: 'sizing', property: 'height', value: '100%' },
  'h-screen': { category: 'sizing', property: 'height', value: '100vh' },
  'h-min': { category: 'sizing', property: 'height', value: 'min-content' },
  'h-max': { category: 'sizing', property: 'height', value: 'max-content' },
  'h-fit': { category: 'sizing', property: 'height', value: 'fit-content' },
  'h-1/2': { category: 'sizing', property: 'height', value: '50%' },
  'h-1/3': { category: 'sizing', property: 'height', value: '33.333333%' },
  'h-2/3': { category: 'sizing', property: 'height', value: '66.666667%' },
  'h-1/4': { category: 'sizing', property: 'height', value: '25%' },
  'h-2/4': { category: 'sizing', property: 'height', value: '50%' },
  'h-3/4': { category: 'sizing', property: 'height', value: '75%' },
  'h-1/5': { category: 'sizing', property: 'height', value: '20%' },
  'h-2/5': { category: 'sizing', property: 'height', value: '40%' },
  'h-3/5': { category: 'sizing', property: 'height', value: '60%' },
  'h-4/5': { category: 'sizing', property: 'height', value: '80%' },
  'h-1/6': { category: 'sizing', property: 'height', value: '16.666667%' },
  'h-5/6': { category: 'sizing', property: 'height', value: '83.333333%' },

  // ============================================
  // GAP (flexboxGrid.gap)
  // ============================================
  'gap-0': { category: 'flexboxGrid', property: 'gap', value: '0rem' },
  'gap-0.5': { category: 'flexboxGrid', property: 'gap', value: '0.125rem' },
  'gap-1': { category: 'flexboxGrid', property: 'gap', value: '0.25rem' },
  'gap-1.5': { category: 'flexboxGrid', property: 'gap', value: '0.375rem' },
  'gap-2': { category: 'flexboxGrid', property: 'gap', value: '0.5rem' },
  'gap-2.5': { category: 'flexboxGrid', property: 'gap', value: '0.625rem' },
  'gap-3': { category: 'flexboxGrid', property: 'gap', value: '0.75rem' },
  'gap-3.5': { category: 'flexboxGrid', property: 'gap', value: '0.875rem' },
  'gap-4': { category: 'flexboxGrid', property: 'gap', value: '1rem' },
  'gap-5': { category: 'flexboxGrid', property: 'gap', value: '1.25rem' },
  'gap-6': { category: 'flexboxGrid', property: 'gap', value: '1.5rem' },
  'gap-7': { category: 'flexboxGrid', property: 'gap', value: '1.75rem' },
  'gap-8': { category: 'flexboxGrid', property: 'gap', value: '2rem' },
  'gap-9': { category: 'flexboxGrid', property: 'gap', value: '2.25rem' },
  'gap-10': { category: 'flexboxGrid', property: 'gap', value: '2.5rem' },
  'gap-11': { category: 'flexboxGrid', property: 'gap', value: '2.75rem' },
  'gap-12': { category: 'flexboxGrid', property: 'gap', value: '3rem' },
  'gap-14': { category: 'flexboxGrid', property: 'gap', value: '3.5rem' },
  'gap-16': { category: 'flexboxGrid', property: 'gap', value: '4rem' },
  'gap-20': { category: 'flexboxGrid', property: 'gap', value: '5rem' },
  'gap-24': { category: 'flexboxGrid', property: 'gap', value: '6rem' },
  'gap-28': { category: 'flexboxGrid', property: 'gap', value: '7rem' },
  'gap-32': { category: 'flexboxGrid', property: 'gap', value: '8rem' },
  'gap-36': { category: 'flexboxGrid', property: 'gap', value: '9rem' },
  'gap-40': { category: 'flexboxGrid', property: 'gap', value: '10rem' },
  'gap-44': { category: 'flexboxGrid', property: 'gap', value: '11rem' },
  'gap-48': { category: 'flexboxGrid', property: 'gap', value: '12rem' },
  'gap-52': { category: 'flexboxGrid', property: 'gap', value: '13rem' },
  'gap-56': { category: 'flexboxGrid', property: 'gap', value: '14rem' },
  'gap-60': { category: 'flexboxGrid', property: 'gap', value: '15rem' },
  'gap-64': { category: 'flexboxGrid', property: 'gap', value: '16rem' },
  'gap-72': { category: 'flexboxGrid', property: 'gap', value: '18rem' },
  'gap-80': { category: 'flexboxGrid', property: 'gap', value: '20rem' },
  'gap-96': { category: 'flexboxGrid', property: 'gap', value: '24rem' },
  'gap-px': { category: 'flexboxGrid', property: 'gap', value: '1px' },

  // ============================================
  // FLEX DIRECTION (flexboxGrid.flexDirection)
  // ============================================
  'flex-row': { category: 'flexboxGrid', property: 'flexDirection', value: 'row' },
  'flex-row-reverse': { category: 'flexboxGrid', property: 'flexDirection', value: 'row-reverse' },
  'flex-col': { category: 'flexboxGrid', property: 'flexDirection', value: 'column' },
  'flex-col-reverse': { category: 'flexboxGrid', property: 'flexDirection', value: 'column-reverse' },

  // ============================================
  // FLEX WRAP (flexboxGrid.flexWrap)
  // ============================================
  'flex-wrap': { category: 'flexboxGrid', property: 'flexWrap', value: 'wrap' },
  'flex-wrap-reverse': { category: 'flexboxGrid', property: 'flexWrap', value: 'wrap-reverse' },
  'flex-nowrap': { category: 'flexboxGrid', property: 'flexWrap', value: 'nowrap' },

  // ============================================
  // FLEX GROW (flexboxGrid.flexGrow)
  // ============================================
  'grow': { category: 'flexboxGrid', property: 'flexGrow', value: 1 },
  'grow-0': { category: 'flexboxGrid', property: 'flexGrow', value: 0 },

  // ============================================
  // FLEX SHRINK (flexboxGrid.flexShrink)
  // ============================================
  'shrink': { category: 'flexboxGrid', property: 'flexShrink', value: 1 },
  'shrink-0': { category: 'flexboxGrid', property: 'flexShrink', value: 0 },

  // ============================================
  // FLEX BASIS (flexboxGrid.flexBasis)
  // ============================================
  'basis-0': { category: 'flexboxGrid', property: 'flexBasis', value: '0px' },
  'basis-1': { category: 'flexboxGrid', property: 'flexBasis', value: '0.25rem' },
  'basis-2': { category: 'flexboxGrid', property: 'flexBasis', value: '0.5rem' },
  'basis-3': { category: 'flexboxGrid', property: 'flexBasis', value: '0.75rem' },
  'basis-4': { category: 'flexboxGrid', property: 'flexBasis', value: '1rem' },
  'basis-5': { category: 'flexboxGrid', property: 'flexBasis', value: '1.25rem' },
  'basis-6': { category: 'flexboxGrid', property: 'flexBasis', value: '1.5rem' },
  'basis-7': { category: 'flexboxGrid', property: 'flexBasis', value: '1.75rem' },
  'basis-8': { category: 'flexboxGrid', property: 'flexBasis', value: '2rem' },
  'basis-9': { category: 'flexboxGrid', property: 'flexBasis', value: '2.25rem' },
  'basis-10': { category: 'flexboxGrid', property: 'flexBasis', value: '2.5rem' },
  'basis-11': { category: 'flexboxGrid', property: 'flexBasis', value: '2.75rem' },
  'basis-12': { category: 'flexboxGrid', property: 'flexBasis', value: '3rem' },
  'basis-14': { category: 'flexboxGrid', property: 'flexBasis', value: '3.5rem' },
  'basis-16': { category: 'flexboxGrid', property: 'flexBasis', value: '4rem' },
  'basis-20': { category: 'flexboxGrid', property: 'flexBasis', value: '5rem' },
  'basis-24': { category: 'flexboxGrid', property: 'flexBasis', value: '6rem' },
  'basis-28': { category: 'flexboxGrid', property: 'flexBasis', value: '7rem' },
  'basis-32': { category: 'flexboxGrid', property: 'flexBasis', value: '8rem' },
  'basis-36': { category: 'flexboxGrid', property: 'flexBasis', value: '9rem' },
  'basis-40': { category: 'flexboxGrid', property: 'flexBasis', value: '10rem' },
  'basis-44': { category: 'flexboxGrid', property: 'flexBasis', value: '11rem' },
  'basis-48': { category: 'flexboxGrid', property: 'flexBasis', value: '12rem' },
  'basis-52': { category: 'flexboxGrid', property: 'flexBasis', value: '13rem' },
  'basis-56': { category: 'flexboxGrid', property: 'flexBasis', value: '14rem' },
  'basis-60': { category: 'flexboxGrid', property: 'flexBasis', value: '15rem' },
  'basis-64': { category: 'flexboxGrid', property: 'flexBasis', value: '16rem' },
  'basis-72': { category: 'flexboxGrid', property: 'flexBasis', value: '18rem' },
  'basis-80': { category: 'flexboxGrid', property: 'flexBasis', value: '20rem' },
  'basis-96': { category: 'flexboxGrid', property: 'flexBasis', value: '24rem' },
  'basis-auto': { category: 'flexboxGrid', property: 'flexBasis', value: 'auto' },
  'basis-px': { category: 'flexboxGrid', property: 'flexBasis', value: '1px' },
  'basis-full': { category: 'flexboxGrid', property: 'flexBasis', value: '100%' },
  'basis-1/2': { category: 'flexboxGrid', property: 'flexBasis', value: '50%' },
  'basis-1/3': { category: 'flexboxGrid', property: 'flexBasis', value: '33.333333%' },
  'basis-2/3': { category: 'flexboxGrid', property: 'flexBasis', value: '66.666667%' },
  'basis-1/4': { category: 'flexboxGrid', property: 'flexBasis', value: '25%' },
  'basis-2/4': { category: 'flexboxGrid', property: 'flexBasis', value: '50%' },
  'basis-3/4': { category: 'flexboxGrid', property: 'flexBasis', value: '75%' },

  // ============================================
  // JUSTIFY CONTENT (flexboxGrid.justifyContent)
  // ============================================
  'justify-normal': { category: 'flexboxGrid', property: 'justifyContent', value: 'normal' },
  'justify-start': { category: 'flexboxGrid', property: 'justifyContent', value: 'flex-start' },
  'justify-end': { category: 'flexboxGrid', property: 'justifyContent', value: 'flex-end' },
  'justify-center': { category: 'flexboxGrid', property: 'justifyContent', value: 'center' },
  'justify-between': { category: 'flexboxGrid', property: 'justifyContent', value: 'space-between' },
  'justify-around': { category: 'flexboxGrid', property: 'justifyContent', value: 'space-around' },
  'justify-evenly': { category: 'flexboxGrid', property: 'justifyContent', value: 'space-evenly' },
  'justify-stretch': { category: 'flexboxGrid', property: 'justifyContent', value: 'stretch' },

  // ============================================
  // JUSTIFY ITEMS (flexboxGrid.justifyItems)
  // ============================================
  'justify-items-start': { category: 'flexboxGrid', property: 'justifyItems', value: 'start' },
  'justify-items-end': { category: 'flexboxGrid', property: 'justifyItems', value: 'end' },
  'justify-items-center': { category: 'flexboxGrid', property: 'justifyItems', value: 'center' },
  'justify-items-stretch': { category: 'flexboxGrid', property: 'justifyItems', value: 'stretch' },

  // ============================================
  // JUSTIFY SELF (flexboxGrid.justifySelf)
  // ============================================
  'justify-self-auto': { category: 'flexboxGrid', property: 'justifySelf', value: 'auto' },
  'justify-self-start': { category: 'flexboxGrid', property: 'justifySelf', value: 'start' },
  'justify-self-end': { category: 'flexboxGrid', property: 'justifySelf', value: 'end' },
  'justify-self-center': { category: 'flexboxGrid', property: 'justifySelf', value: 'center' },
  'justify-self-stretch': { category: 'flexboxGrid', property: 'justifySelf', value: 'stretch' },

  // ============================================
  // ALIGN ITEMS (flexboxGrid.alignItems)
  // ============================================
  'items-start': { category: 'flexboxGrid', property: 'alignItems', value: 'flex-start' },
  'items-end': { category: 'flexboxGrid', property: 'alignItems', value: 'flex-end' },
  'items-center': { category: 'flexboxGrid', property: 'alignItems', value: 'center' },
  'items-baseline': { category: 'flexboxGrid', property: 'alignItems', value: 'baseline' },
  'items-stretch': { category: 'flexboxGrid', property: 'alignItems', value: 'stretch' },

  // ============================================
  // ALIGN CONTENT (flexboxGrid.alignContent)
  // ============================================
  'content-normal': { category: 'flexboxGrid', property: 'alignContent', value: 'normal' },
  'content-start': { category: 'flexboxGrid', property: 'alignContent', value: 'flex-start' },
  'content-end': { category: 'flexboxGrid', property: 'alignContent', value: 'flex-end' },
  'content-center': { category: 'flexboxGrid', property: 'alignContent', value: 'center' },
  'content-between': { category: 'flexboxGrid', property: 'alignContent', value: 'space-between' },
  'content-around': { category: 'flexboxGrid', property: 'alignContent', value: 'space-around' },
  'content-evenly': { category: 'flexboxGrid', property: 'alignContent', value: 'space-evenly' },
  'content-baseline': { category: 'flexboxGrid', property: 'alignContent', value: 'baseline' },
  'content-stretch': { category: 'flexboxGrid', property: 'alignContent', value: 'stretch' },

  // ============================================
  // ALIGN SELF (flexboxGrid.alignSelf)
  // ============================================
  'self-auto': { category: 'flexboxGrid', property: 'alignSelf', value: 'auto' },
  'self-start': { category: 'flexboxGrid', property: 'alignSelf', value: 'flex-start' },
  'self-end': { category: 'flexboxGrid', property: 'alignSelf', value: 'flex-end' },
  'self-center': { category: 'flexboxGrid', property: 'alignSelf', value: 'center' },
  'self-stretch': { category: 'flexboxGrid', property: 'alignSelf', value: 'stretch' },
  'self-baseline': { category: 'flexboxGrid', property: 'alignSelf', value: 'baseline' },

  // ============================================
  // PLACE ITEMS (flexboxGrid.placeItems)
  // ============================================
  'place-items-start': { category: 'flexboxGrid', property: 'placeItems', value: 'start' },
  'place-items-end': { category: 'flexboxGrid', property: 'placeItems', value: 'end' },
  'place-items-center': { category: 'flexboxGrid', property: 'placeItems', value: 'center' },
  'place-items-baseline': { category: 'flexboxGrid', property: 'placeItems', value: 'baseline' },
  'place-items-stretch': { category: 'flexboxGrid', property: 'placeItems', value: 'stretch' },

  // ============================================
  // GRID TEMPLATE COLUMNS (flexboxGrid.gridTemplateColumns)
  // ============================================
  'grid-cols-1': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'repeat(1, minmax(0, 1fr))' },
  'grid-cols-2': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'repeat(2, minmax(0, 1fr))' },
  'grid-cols-3': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'repeat(3, minmax(0, 1fr))' },
  'grid-cols-4': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'repeat(4, minmax(0, 1fr))' },
  'grid-cols-5': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'repeat(5, minmax(0, 1fr))' },
  'grid-cols-6': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'repeat(6, minmax(0, 1fr))' },
  'grid-cols-7': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'repeat(7, minmax(0, 1fr))' },
  'grid-cols-8': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'repeat(8, minmax(0, 1fr))' },
  'grid-cols-9': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'repeat(9, minmax(0, 1fr))' },
  'grid-cols-10': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'repeat(10, minmax(0, 1fr))' },
  'grid-cols-11': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'repeat(11, minmax(0, 1fr))' },
  'grid-cols-12': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'repeat(12, minmax(0, 1fr))' },
  'grid-cols-none': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'none' },
  'grid-cols-subgrid': { category: 'flexboxGrid', property: 'gridTemplateColumns', value: 'subgrid' },

  // ============================================
  // GRID TEMPLATE ROWS (flexboxGrid.gridTemplateRows)
  // ============================================
  'grid-rows-1': { category: 'flexboxGrid', property: 'gridTemplateRows', value: 'repeat(1, minmax(0, 1fr))' },
  'grid-rows-2': { category: 'flexboxGrid', property: 'gridTemplateRows', value: 'repeat(2, minmax(0, 1fr))' },
  'grid-rows-3': { category: 'flexboxGrid', property: 'gridTemplateRows', value: 'repeat(3, minmax(0, 1fr))' },
  'grid-rows-4': { category: 'flexboxGrid', property: 'gridTemplateRows', value: 'repeat(4, minmax(0, 1fr))' },
  'grid-rows-5': { category: 'flexboxGrid', property: 'gridTemplateRows', value: 'repeat(5, minmax(0, 1fr))' },
  'grid-rows-6': { category: 'flexboxGrid', property: 'gridTemplateRows', value: 'repeat(6, minmax(0, 1fr))' },
  'grid-rows-none': { category: 'flexboxGrid', property: 'gridTemplateRows', value: 'none' },
  'grid-rows-subgrid': { category: 'flexboxGrid', property: 'gridTemplateRows', value: 'subgrid' },

  // ============================================
  // GRID COLUMN (flexboxGrid.gridColumn)
  // ============================================
  'col-auto': { category: 'flexboxGrid', property: 'gridColumn', value: 'auto' },
  'col-span-1': { category: 'flexboxGrid', property: 'gridColumn', value: 'span 1 / span 1' },
  'col-span-2': { category: 'flexboxGrid', property: 'gridColumn', value: 'span 2 / span 2' },
  'col-span-3': { category: 'flexboxGrid', property: 'gridColumn', value: 'span 3 / span 3' },
  'col-span-4': { category: 'flexboxGrid', property: 'gridColumn', value: 'span 4 / span 4' },
  'col-span-5': { category: 'flexboxGrid', property: 'gridColumn', value: 'span 5 / span 5' },
  'col-span-6': { category: 'flexboxGrid', property: 'gridColumn', value: 'span 6 / span 6' },
  'col-span-7': { category: 'flexboxGrid', property: 'gridColumn', value: 'span 7 / span 7' },
  'col-span-8': { category: 'flexboxGrid', property: 'gridColumn', value: 'span 8 / span 8' },
  'col-span-9': { category: 'flexboxGrid', property: 'gridColumn', value: 'span 9 / span 9' },
  'col-span-10': { category: 'flexboxGrid', property: 'gridColumn', value: 'span 10 / span 10' },
  'col-span-11': { category: 'flexboxGrid', property: 'gridColumn', value: 'span 11 / span 11' },
  'col-span-12': { category: 'flexboxGrid', property: 'gridColumn', value: 'span 12 / span 12' },
  'col-span-full': { category: 'flexboxGrid', property: 'gridColumn', value: '1 / -1' },

  // ============================================
  // GRID COLUMN START (flexboxGrid.gridColumnStart)
  // ============================================
  'col-start-1': { category: 'flexboxGrid', property: 'gridColumnStart', value: '1' },
  'col-start-2': { category: 'flexboxGrid', property: 'gridColumnStart', value: '2' },
  'col-start-3': { category: 'flexboxGrid', property: 'gridColumnStart', value: '3' },
  'col-start-4': { category: 'flexboxGrid', property: 'gridColumnStart', value: '4' },
  'col-start-5': { category: 'flexboxGrid', property: 'gridColumnStart', value: '5' },
  'col-start-6': { category: 'flexboxGrid', property: 'gridColumnStart', value: '6' },
  'col-start-7': { category: 'flexboxGrid', property: 'gridColumnStart', value: '7' },
  'col-start-8': { category: 'flexboxGrid', property: 'gridColumnStart', value: '8' },
  'col-start-9': { category: 'flexboxGrid', property: 'gridColumnStart', value: '9' },
  'col-start-10': { category: 'flexboxGrid', property: 'gridColumnStart', value: '10' },
  'col-start-11': { category: 'flexboxGrid', property: 'gridColumnStart', value: '11' },
  'col-start-12': { category: 'flexboxGrid', property: 'gridColumnStart', value: '12' },
  'col-start-13': { category: 'flexboxGrid', property: 'gridColumnStart', value: '13' },
  'col-start-auto': { category: 'flexboxGrid', property: 'gridColumnStart', value: 'auto' },

  // ============================================
  // GRID COLUMN END (flexboxGrid.gridColumnEnd)
  // ============================================
  'col-end-1': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '1' },
  'col-end-2': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '2' },
  'col-end-3': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '3' },
  'col-end-4': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '4' },
  'col-end-5': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '5' },
  'col-end-6': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '6' },
  'col-end-7': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '7' },
  'col-end-8': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '8' },
  'col-end-9': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '9' },
  'col-end-10': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '10' },
  'col-end-11': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '11' },
  'col-end-12': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '12' },
  'col-end-13': { category: 'flexboxGrid', property: 'gridColumnEnd', value: '13' },
  'col-end-auto': { category: 'flexboxGrid', property: 'gridColumnEnd', value: 'auto' },

  // ============================================
  // GRID ROW (flexboxGrid.gridRow)
  // ============================================
  'row-auto': { category: 'flexboxGrid', property: 'gridRow', value: 'auto' },
  'row-span-1': { category: 'flexboxGrid', property: 'gridRow', value: 'span 1 / span 1' },
  'row-span-2': { category: 'flexboxGrid', property: 'gridRow', value: 'span 2 / span 2' },
  'row-span-3': { category: 'flexboxGrid', property: 'gridRow', value: 'span 3 / span 3' },
  'row-span-4': { category: 'flexboxGrid', property: 'gridRow', value: 'span 4 / span 4' },
  'row-span-5': { category: 'flexboxGrid', property: 'gridRow', value: 'span 5 / span 5' },
  'row-span-6': { category: 'flexboxGrid', property: 'gridRow', value: 'span 6 / span 6' },
  'row-span-full': { category: 'flexboxGrid', property: 'gridRow', value: '1 / -1' },

  // ============================================
  // GRID ROW START (flexboxGrid.gridRowStart)
  // ============================================
  'row-start-1': { category: 'flexboxGrid', property: 'gridRowStart', value: '1' },
  'row-start-2': { category: 'flexboxGrid', property: 'gridRowStart', value: '2' },
  'row-start-3': { category: 'flexboxGrid', property: 'gridRowStart', value: '3' },
  'row-start-4': { category: 'flexboxGrid', property: 'gridRowStart', value: '4' },
  'row-start-5': { category: 'flexboxGrid', property: 'gridRowStart', value: '5' },
  'row-start-6': { category: 'flexboxGrid', property: 'gridRowStart', value: '6' },
  'row-start-7': { category: 'flexboxGrid', property: 'gridRowStart', value: '7' },
  'row-start-auto': { category: 'flexboxGrid', property: 'gridRowStart', value: 'auto' },

  // ============================================
  // GRID ROW END (flexboxGrid.gridRowEnd)
  // ============================================
  'row-end-1': { category: 'flexboxGrid', property: 'gridRowEnd', value: '1' },
  'row-end-2': { category: 'flexboxGrid', property: 'gridRowEnd', value: '2' },
  'row-end-3': { category: 'flexboxGrid', property: 'gridRowEnd', value: '3' },
  'row-end-4': { category: 'flexboxGrid', property: 'gridRowEnd', value: '4' },
  'row-end-5': { category: 'flexboxGrid', property: 'gridRowEnd', value: '5' },
  'row-end-6': { category: 'flexboxGrid', property: 'gridRowEnd', value: '6' },
  'row-end-7': { category: 'flexboxGrid', property: 'gridRowEnd', value: '7' },
  'row-end-auto': { category: 'flexboxGrid', property: 'gridRowEnd', value: 'auto' },

  // ============================================
  // GRID AUTO FLOW (flexboxGrid.gridAutoFlow)
  // ============================================
  'grid-flow-row': { category: 'flexboxGrid', property: 'gridAutoFlow', value: 'row' },
  'grid-flow-col': { category: 'flexboxGrid', property: 'gridAutoFlow', value: 'column' },
  'grid-flow-dense': { category: 'flexboxGrid', property: 'gridAutoFlow', value: 'dense' },
  'grid-flow-row-dense': { category: 'flexboxGrid', property: 'gridAutoFlow', value: 'row dense' },
  'grid-flow-col-dense': { category: 'flexboxGrid', property: 'gridAutoFlow', value: 'column dense' },

  // ============================================
  // GRID AUTO COLUMNS (flexboxGrid.gridAutoColumns)
  // ============================================
  'auto-cols-auto': { category: 'flexboxGrid', property: 'gridAutoColumns', value: 'auto' },
  'auto-cols-min': { category: 'flexboxGrid', property: 'gridAutoColumns', value: 'min-content' },
  'auto-cols-max': { category: 'flexboxGrid', property: 'gridAutoColumns', value: 'max-content' },
  'auto-cols-fr': { category: 'flexboxGrid', property: 'gridAutoColumns', value: 'minmax(0, 1fr)' },

  // ============================================
  // GRID AUTO ROWS (flexboxGrid.gridAutoRows)
  // ============================================
  'auto-rows-auto': { category: 'flexboxGrid', property: 'gridAutoRows', value: 'auto' },
  'auto-rows-min': { category: 'flexboxGrid', property: 'gridAutoRows', value: 'min-content' },
  'auto-rows-max': { category: 'flexboxGrid', property: 'gridAutoRows', value: 'max-content' },
  'auto-rows-fr': { category: 'flexboxGrid', property: 'gridAutoRows', value: 'minmax(0, 1fr)' },
};

/**
 * Build a reverse map from CSS values to Tailwind classes.
 * Key format: "category.property:value"
 */
export function buildCssToTailwindMap(): Map<string, string> {
  const map = new Map<string, string>();

  for (const [tailwindClass, mapping] of Object.entries(TAILWIND_TO_CSS_MAP)) {
    const key = `${mapping.category}.${mapping.property}:${mapping.value}`;
    // Don't overwrite if we already have a mapping (prefer shorter class names)
    if (!map.has(key)) {
      map.set(key, tailwindClass);
    }
  }

  return map;
}
