#!/usr/bin/env node

/**
 * Generates a list of Tailwind CSS classes with their CSS values
 * for use in autocomplete
 */

const path = require('path');

// Common Tailwind utilities with their patterns
const utilities = [
  // Layout
  { pattern: 'container', css: 'max-width: 100%;' },
  { pattern: 'block', css: 'display: block;' },
  { pattern: 'inline-block', css: 'display: inline-block;' },
  { pattern: 'inline', css: 'display: inline;' },
  { pattern: 'flex', css: 'display: flex;' },
  { pattern: 'inline-flex', css: 'display: inline-flex;' },
  { pattern: 'grid', css: 'display: grid;' },
  { pattern: 'inline-grid', css: 'display: inline-grid;' },
  { pattern: 'hidden', css: 'display: none;' },

  // Flexbox
  { pattern: 'flex-row', css: 'flex-direction: row;' },
  { pattern: 'flex-row-reverse', css: 'flex-direction: row-reverse;' },
  { pattern: 'flex-col', css: 'flex-direction: column;' },
  { pattern: 'flex-col-reverse', css: 'flex-direction: column-reverse;' },
  { pattern: 'flex-wrap', css: 'flex-wrap: wrap;' },
  { pattern: 'flex-wrap-reverse', css: 'flex-wrap: wrap-reverse;' },
  { pattern: 'flex-nowrap', css: 'flex-wrap: nowrap;' },
  { pattern: 'flex-1', css: 'flex: 1 1 0%;' },
  { pattern: 'flex-auto', css: 'flex: 1 1 auto;' },
  { pattern: 'flex-initial', css: 'flex: 0 1 auto;' },
  { pattern: 'flex-none', css: 'flex: none;' },

  // Grid
  { pattern: 'grid-cols-1', css: 'grid-template-columns: repeat(1, minmax(0, 1fr));' },
  { pattern: 'grid-cols-2', css: 'grid-template-columns: repeat(2, minmax(0, 1fr));' },
  { pattern: 'grid-cols-3', css: 'grid-template-columns: repeat(3, minmax(0, 1fr));' },
  { pattern: 'grid-cols-4', css: 'grid-template-columns: repeat(4, minmax(0, 1fr));' },
  { pattern: 'grid-cols-12', css: 'grid-template-columns: repeat(12, minmax(0, 1fr));' },

  // Positioning
  { pattern: 'static', css: 'position: static;' },
  { pattern: 'fixed', css: 'position: fixed;' },
  { pattern: 'absolute', css: 'position: absolute;' },
  { pattern: 'relative', css: 'position: relative;' },
  { pattern: 'sticky', css: 'position: sticky;' },
];

// Generate spacing utilities (p, m, gap, etc.)
const spacingValues = ['0', '0.5', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '64', 'px', 'auto'];
const spacingPrefixes = [
  { prefix: 'p', css: 'padding' },
  { prefix: 'pt', css: 'padding-top' },
  { prefix: 'pr', css: 'padding-right' },
  { prefix: 'pb', css: 'padding-bottom' },
  { prefix: 'pl', css: 'padding-left' },
  { prefix: 'px', css: 'padding-left & padding-right' },
  { prefix: 'py', css: 'padding-top & padding-bottom' },
  { prefix: 'm', css: 'margin' },
  { prefix: 'mt', css: 'margin-top' },
  { prefix: 'mr', css: 'margin-right' },
  { prefix: 'mb', css: 'margin-bottom' },
  { prefix: 'ml', css: 'margin-left' },
  { prefix: 'mx', css: 'margin-left & margin-right' },
  { prefix: 'my', css: 'margin-top & margin-bottom' },
  { prefix: 'gap', css: 'gap' },
  { prefix: 'gap-x', css: 'column-gap' },
  { prefix: 'gap-y', css: 'row-gap' },
];

spacingPrefixes.forEach(({ prefix, css }) => {
  spacingValues.forEach(value => {
    utilities.push({
      pattern: `${prefix}-${value}`,
      css: `${css}: ${value === 'px' ? '1px' : value === 'auto' ? 'auto' : `${parseFloat(value) * 0.25}rem`};`
    });
  });
});

// Generate width/height utilities
const sizeValues = ['0', 'auto', 'full', 'screen', '1/2', '1/3', '2/3', '1/4', '3/4'];
['w', 'h'].forEach(prefix => {
  const prop = prefix === 'w' ? 'width' : 'height';
  sizeValues.forEach(value => {
    let cssValue = value;
    if (value === 'full') cssValue = '100%';
    else if (value === 'screen') cssValue = prefix === 'w' ? '100vw' : '100vh';
    else if (value.includes('/')) {
      const [num, denom] = value.split('/');
      cssValue = `${(parseFloat(num) / parseFloat(denom) * 100).toFixed(6)}%`;
    }

    utilities.push({
      pattern: `${prefix}-${value}`,
      css: `${prop}: ${cssValue};`
    });
  });
});

// Generate text utilities
const textSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
textSizes.forEach(size => {
  utilities.push({
    pattern: `text-${size}`,
    css: `font-size: ${size};`
  });
});

['left', 'center', 'right', 'justify'].forEach(align => {
  utilities.push({
    pattern: `text-${align}`,
    css: `text-align: ${align};`
  });
});

// Generate color utilities
const colors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const colorPrefixes = ['bg', 'text', 'border'];

colorPrefixes.forEach(prefix => {
  colors.forEach(color => {
    shades.forEach(shade => {
      const prop = prefix === 'bg' ? 'background-color' : prefix === 'text' ? 'color' : 'border-color';
      utilities.push({
        pattern: `${prefix}-${color}-${shade}`,
        css: `${prop}: ${color}-${shade};`
      });
    });
  });
});

// Add transparent colors
['bg', 'text', 'border'].forEach(prefix => {
  utilities.push({
    pattern: `${prefix}-transparent`,
    css: `${prefix === 'bg' ? 'background-color' : prefix === 'text' ? 'color' : 'border-color'}: transparent;`
  });
  utilities.push({
    pattern: `${prefix}-current`,
    css: `${prefix === 'bg' ? 'background-color' : prefix === 'text' ? 'color' : 'border-color'}: currentColor;`
  });
  utilities.push({
    pattern: `${prefix}-black`,
    css: `${prefix === 'bg' ? 'background-color' : prefix === 'text' ? 'color' : 'border-color'}: #000;`
  });
  utilities.push({
    pattern: `${prefix}-white`,
    css: `${prefix === 'bg' ? 'background-color' : prefix === 'text' ? 'color' : 'border-color'}: #fff;`
  });
});

// Add more positioning utilities
['top', 'right', 'bottom', 'left'].forEach(side => {
  ['0', '1', '2', '4', '8', '16', 'auto'].forEach(value => {
    utilities.push({
      pattern: `${side}-${value}`,
      css: `${side}: ${value === 'auto' ? 'auto' : `${parseFloat(value) * 0.25}rem`};`
    });
  });
});

// Add inset utilities
utilities.push({ pattern: 'inset-0', css: 'inset: 0;' });
utilities.push({ pattern: 'inset-auto', css: 'inset: auto;' });

// Add z-index utilities
[0, 10, 20, 30, 40, 50, 'auto'].forEach(z => {
  utilities.push({
    pattern: `z-${z}`,
    css: `z-index: ${z};`
  });
});

// Add border utilities
['0', '2', '4', '8'].forEach(width => {
  utilities.push({
    pattern: `border-${width}`,
    css: `border-width: ${width}px;`
  });
});
utilities.push({ pattern: 'border', css: 'border-width: 1px;' });

['t', 'r', 'b', 'l'].forEach(side => {
  const fullSide = { t: 'top', r: 'right', b: 'bottom', l: 'left' }[side];
  utilities.push({
    pattern: `border-${side}`,
    css: `border-${fullSide}-width: 1px;`
  });
});

// Add border radius
['none', 'sm', '', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].forEach(size => {
  const sizeMap = { none: '0', sm: '0.125rem', '': '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem', '2xl': '1rem', '3xl': '1.5rem', full: '9999px' };
  utilities.push({
    pattern: size ? `rounded-${size}` : 'rounded',
    css: `border-radius: ${sizeMap[size]};`
  });
});

// Add opacity utilities
[0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100].forEach(opacity => {
  utilities.push({
    pattern: `opacity-${opacity}`,
    css: `opacity: ${opacity / 100};`
  });
});

// Add shadow utilities
const shadows = {
  'shadow-sm': 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);',
  'shadow': 'box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);',
  'shadow-md': 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);',
  'shadow-lg': 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);',
  'shadow-xl': 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);',
  'shadow-2xl': 'box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);',
  'shadow-none': 'box-shadow: none;'
};
Object.entries(shadows).forEach(([pattern, css]) => {
  utilities.push({ pattern, css });
});

// Add cursor utilities
['auto', 'default', 'pointer', 'wait', 'text', 'move', 'not-allowed', 'grab', 'grabbing'].forEach(cursor => {
  utilities.push({
    pattern: `cursor-${cursor}`,
    css: `cursor: ${cursor};`
  });
});

// Add overflow utilities
['auto', 'hidden', 'visible', 'scroll'].forEach(overflow => {
  utilities.push({
    pattern: `overflow-${overflow}`,
    css: `overflow: ${overflow};`
  });
  utilities.push({
    pattern: `overflow-x-${overflow}`,
    css: `overflow-x: ${overflow};`
  });
  utilities.push({
    pattern: `overflow-y-${overflow}`,
    css: `overflow-y: ${overflow};`
  });
});

// Add font weight utilities
const weights = {
  'font-thin': 'font-weight: 100;',
  'font-extralight': 'font-weight: 200;',
  'font-light': 'font-weight: 300;',
  'font-normal': 'font-weight: 400;',
  'font-medium': 'font-weight: 500;',
  'font-semibold': 'font-weight: 600;',
  'font-bold': 'font-weight: 700;',
  'font-extrabold': 'font-weight: 800;',
  'font-black': 'font-weight: 900;'
};
Object.entries(weights).forEach(([pattern, css]) => {
  utilities.push({ pattern, css });
});

// Add alignment utilities
['items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch'].forEach(pattern => {
  const value = pattern.replace('items-', '');
  utilities.push({
    pattern,
    css: `align-items: ${value};`
  });
});

['justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly'].forEach(pattern => {
  const value = pattern.replace('justify-', '');
  utilities.push({
    pattern,
    css: `justify-content: ${value};`
  });
});

['self-auto', 'self-start', 'self-end', 'self-center', 'self-stretch'].forEach(pattern => {
  const value = pattern.replace('self-', '');
  utilities.push({
    pattern,
    css: `align-self: ${value};`
  });
});

// Generate variants
const variants = [
  'hover', 'focus', 'active', 'visited',
  'focus-within', 'focus-visible',
  'disabled', 'enabled',
  'first', 'last', 'odd', 'even',
  'sm', 'md', 'lg', 'xl', '2xl',
  'dark'
];

console.log('Generating Tailwind class data...');
console.log(`Total utilities: ${utilities.length}`);
console.log(`Variants: ${variants.length}`);

// Write to JSON file
const fs = require('fs');
const outputPath = path.join(__dirname, '../libs/shared/src/lib/code-editor/tailwind-classes.json');

const output = {
  utilities: utilities.map(u => ({
    label: u.pattern,
    detail: u.css,
    type: 'class'
  })),
  variants: variants.map(v => ({
    label: `${v}:`,
    detail: `Apply on ${v}`,
    type: 'variant'
  }))
};

// Create directory if it doesn't exist
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`✓ Generated ${outputPath}`);
console.log(`  - ${output.utilities.length} utilities`);
console.log(`  - ${output.variants.length} variants`);
