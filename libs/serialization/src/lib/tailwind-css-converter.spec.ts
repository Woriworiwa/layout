import { describe, it, expect, beforeEach } from 'vitest';
import { TailwindCssConverter, TailwindParseResult } from './tailwind-css-converter';
import { Css } from '@layout/models';

describe('TailwindCssConverter', () => {
  let converter: TailwindCssConverter;

  beforeEach(() => {
    converter = new TailwindCssConverter();
  });

  describe('cssToTailwind', () => {
    describe('WHEN converting layout properties', () => {
      it('SHOULD return empty array for undefined CSS', () => {
        const result = converter.cssToTailwind(undefined);
        expect(result).toEqual([]);
      });

      it('SHOULD return empty array for empty CSS object', () => {
        const result = converter.cssToTailwind({});
        expect(result).toEqual([]);
      });

      it('SHOULD convert display: flex to "flex"', () => {
        const css: Css = { layout: { display: 'flex' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('flex');
      });

      it('SHOULD convert display: grid to "grid"', () => {
        const css: Css = { layout: { display: 'grid' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('grid');
      });

      it('SHOULD convert display: block to "block"', () => {
        const css: Css = { layout: { display: 'block' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('block');
      });

      it('SHOULD convert display: none to "hidden"', () => {
        const css: Css = { layout: { display: 'none' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('hidden');
      });
    });

    describe('WHEN converting flexbox properties', () => {
      it('SHOULD convert flex-direction: row to "flex-row"', () => {
        const css: Css = { flexboxGrid: { flexDirection: 'row' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('flex-row');
      });

      it('SHOULD convert flex-direction: column to "flex-col"', () => {
        const css: Css = { flexboxGrid: { flexDirection: 'column' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('flex-col');
      });

      it('SHOULD convert justify-content: center to "justify-center"', () => {
        const css: Css = { flexboxGrid: { justifyContent: 'center' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('justify-center');
      });

      it('SHOULD convert justify-content: space-between to "justify-between"', () => {
        const css: Css = { flexboxGrid: { justifyContent: 'space-between' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('justify-between');
      });

      it('SHOULD convert align-items: center to "items-center"', () => {
        const css: Css = { flexboxGrid: { alignItems: 'center' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('items-center');
      });

      it('SHOULD convert align-items: flex-start to "items-start"', () => {
        const css: Css = { flexboxGrid: { alignItems: 'flex-start' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('items-start');
      });

      it('SHOULD convert flex-wrap: wrap to "flex-wrap"', () => {
        const css: Css = { flexboxGrid: { flexWrap: 'wrap' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('flex-wrap');
      });
    });

    describe('WHEN converting gap properties', () => {
      it('SHOULD convert gap: 1rem to "gap-4"', () => {
        const css: Css = { flexboxGrid: { gap: '1rem' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('gap-4');
      });

      it('SHOULD convert gap: 0.5rem to "gap-2"', () => {
        const css: Css = { flexboxGrid: { gap: '0.5rem' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('gap-2');
      });

      it('SHOULD convert numeric gap to arbitrary value', () => {
        const css: Css = { flexboxGrid: { gap: '17' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('gap-[17px]');
      });

      it('SHOULD convert custom gap value to arbitrary syntax', () => {
        const css: Css = { flexboxGrid: { gap: '13px' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('gap-[13px]');
      });
    });

    describe('WHEN converting spacing properties', () => {
      it('SHOULD convert padding: 1rem to "p-4"', () => {
        const css: Css = { spacing: { padding: '1rem' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('p-4');
      });

      it('SHOULD convert margin: 0.5rem to "m-2"', () => {
        const css: Css = { spacing: { margin: '0.5rem' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('m-2');
      });

      it('SHOULD convert custom padding to arbitrary value', () => {
        const css: Css = { spacing: { padding: '17px' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('p-[17px]');
      });

      it('SHOULD convert custom margin to arbitrary value', () => {
        const css: Css = { spacing: { margin: '23px' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('m-[23px]');
      });
    });

    describe('WHEN converting sizing properties', () => {
      it('SHOULD convert width: 100% to "w-full"', () => {
        const css: Css = { sizing: { width: '100%' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('w-full');
      });

      it('SHOULD convert height: 100% to "h-full"', () => {
        const css: Css = { sizing: { height: '100%' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('h-full');
      });

      it('SHOULD convert width: auto to "w-auto"', () => {
        const css: Css = { sizing: { width: 'auto' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('w-auto');
      });

      it('SHOULD convert custom width to arbitrary value', () => {
        const css: Css = { sizing: { width: '200px' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('w-[200px]');
      });
    });

    describe('WHEN converting grid properties', () => {
      it('SHOULD convert grid-template-columns with spaces to underscore syntax', () => {
        const css: Css = { flexboxGrid: { gridTemplateColumns: '1fr 1fr' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('grid-cols-[1fr_1fr]');
      });

      it('SHOULD convert grid-template-rows with spaces to underscore syntax', () => {
        const css: Css = { flexboxGrid: { gridTemplateRows: '1fr 2fr' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('grid-rows-[1fr_2fr]');
      });

      it('SHOULD convert grid-auto-flow: row to "grid-flow-row"', () => {
        const css: Css = { flexboxGrid: { gridAutoFlow: 'row' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('grid-flow-row');
      });

      it('SHOULD convert grid-auto-flow: column to "grid-flow-col"', () => {
        const css: Css = { flexboxGrid: { gridAutoFlow: 'column' } };
        const result = converter.cssToTailwind(css);
        expect(result).toContain('grid-flow-col');
      });
    });

    describe('WHEN converting multiple properties', () => {
      it('SHOULD convert all properties in a complex CSS object', () => {
        const css: Css = {
          layout: { display: 'flex' },
          flexboxGrid: {
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
          },
          spacing: { padding: '1rem' },
        };
        const result = converter.cssToTailwind(css);

        expect(result).toContain('flex');
        expect(result).toContain('justify-center');
        expect(result).toContain('items-center');
        expect(result).toContain('gap-4');
        expect(result).toContain('p-4');
      });
    });
  });

  describe('tailwindToCss', () => {
    describe('WHEN parsing empty or invalid input', () => {
      it('SHOULD return empty result for empty string', () => {
        const result = converter.tailwindToCss('');
        expect(result.css).toEqual({});
        expect(result.unsupportedClasses).toEqual([]);
      });

      it('SHOULD return empty result for whitespace only', () => {
        const result = converter.tailwindToCss('   ');
        expect(result.css).toEqual({});
        expect(result.unsupportedClasses).toEqual([]);
      });
    });

    describe('WHEN parsing layout classes', () => {
      it('SHOULD parse "flex" to display: flex', () => {
        const result = converter.tailwindToCss('flex');
        expect(result.css.layout?.display).toBe('flex');
      });

      it('SHOULD parse "grid" to display: grid', () => {
        const result = converter.tailwindToCss('grid');
        expect(result.css.layout?.display).toBe('grid');
      });

      it('SHOULD parse "block" to display: block', () => {
        const result = converter.tailwindToCss('block');
        expect(result.css.layout?.display).toBe('block');
      });

      it('SHOULD parse "hidden" to display: none', () => {
        const result = converter.tailwindToCss('hidden');
        expect(result.css.layout?.display).toBe('none');
      });

      it('SHOULD parse "inline-flex" to display: inline-flex', () => {
        const result = converter.tailwindToCss('inline-flex');
        expect(result.css.layout?.display).toBe('inline-flex');
      });
    });

    describe('WHEN parsing flexbox classes', () => {
      it('SHOULD parse "flex-row" to flex-direction: row', () => {
        const result = converter.tailwindToCss('flex-row');
        expect(result.css.flexboxGrid?.flexDirection).toBe('row');
      });

      it('SHOULD parse "flex-col" to flex-direction: column', () => {
        const result = converter.tailwindToCss('flex-col');
        expect(result.css.flexboxGrid?.flexDirection).toBe('column');
      });

      it('SHOULD parse "justify-center" to justify-content: center', () => {
        const result = converter.tailwindToCss('justify-center');
        expect(result.css.flexboxGrid?.justifyContent).toBe('center');
      });

      it('SHOULD parse "justify-between" to justify-content: space-between', () => {
        const result = converter.tailwindToCss('justify-between');
        expect(result.css.flexboxGrid?.justifyContent).toBe('space-between');
      });

      it('SHOULD parse "items-center" to align-items: center', () => {
        const result = converter.tailwindToCss('items-center');
        expect(result.css.flexboxGrid?.alignItems).toBe('center');
      });

      it('SHOULD parse "items-start" to align-items: flex-start', () => {
        const result = converter.tailwindToCss('items-start');
        expect(result.css.flexboxGrid?.alignItems).toBe('flex-start');
      });

      it('SHOULD parse "flex-wrap" to flex-wrap: wrap', () => {
        const result = converter.tailwindToCss('flex-wrap');
        expect(result.css.flexboxGrid?.flexWrap).toBe('wrap');
      });

      it('SHOULD parse "flex-nowrap" to flex-wrap: nowrap', () => {
        const result = converter.tailwindToCss('flex-nowrap');
        expect(result.css.flexboxGrid?.flexWrap).toBe('nowrap');
      });
    });

    describe('WHEN parsing gap classes', () => {
      it('SHOULD parse "gap-4" to gap: 1rem', () => {
        const result = converter.tailwindToCss('gap-4');
        expect(result.css.flexboxGrid?.gap).toBe('1rem');
      });

      it('SHOULD parse "gap-2" to gap: 0.5rem', () => {
        const result = converter.tailwindToCss('gap-2');
        expect(result.css.flexboxGrid?.gap).toBe('0.5rem');
      });

      it('SHOULD parse "gap-0" to gap: 0rem', () => {
        const result = converter.tailwindToCss('gap-0');
        expect(result.css.flexboxGrid?.gap).toBe('0rem');
      });

      it('SHOULD parse arbitrary gap "gap-[17px]"', () => {
        const result = converter.tailwindToCss('gap-[17px]');
        expect(result.css.flexboxGrid?.gap).toBe('17px');
      });

      it('SHOULD parse arbitrary gap "gap-[1.5rem]"', () => {
        const result = converter.tailwindToCss('gap-[1.5rem]');
        expect(result.css.flexboxGrid?.gap).toBe('1.5rem');
      });
    });

    describe('WHEN parsing spacing classes', () => {
      it('SHOULD parse "p-4" to padding: 1rem', () => {
        const result = converter.tailwindToCss('p-4');
        expect(result.css.spacing?.padding).toBe('1rem');
      });

      it('SHOULD parse "m-2" to margin: 0.5rem', () => {
        const result = converter.tailwindToCss('m-2');
        expect(result.css.spacing?.margin).toBe('0.5rem');
      });

      it('SHOULD parse "p-0" to padding: 0rem', () => {
        const result = converter.tailwindToCss('p-0');
        expect(result.css.spacing?.padding).toBe('0rem');
      });

      it('SHOULD parse arbitrary padding "p-[17px]"', () => {
        const result = converter.tailwindToCss('p-[17px]');
        expect(result.css.spacing?.padding).toBe('17px');
      });

      it('SHOULD parse arbitrary margin "m-[2rem]"', () => {
        const result = converter.tailwindToCss('m-[2rem]');
        expect(result.css.spacing?.margin).toBe('2rem');
      });
    });

    describe('WHEN parsing sizing classes', () => {
      it('SHOULD parse "w-full" to width: 100%', () => {
        const result = converter.tailwindToCss('w-full');
        expect(result.css.sizing?.width).toBe('100%');
      });

      it('SHOULD parse "h-full" to height: 100%', () => {
        const result = converter.tailwindToCss('h-full');
        expect(result.css.sizing?.height).toBe('100%');
      });

      it('SHOULD parse "w-auto" to width: auto', () => {
        const result = converter.tailwindToCss('w-auto');
        expect(result.css.sizing?.width).toBe('auto');
      });

      it('SHOULD parse "h-screen" to height: 100vh', () => {
        const result = converter.tailwindToCss('h-screen');
        expect(result.css.sizing?.height).toBe('100vh');
      });

      it('SHOULD parse arbitrary width "w-[200px]"', () => {
        const result = converter.tailwindToCss('w-[200px]');
        expect(result.css.sizing?.width).toBe('200px');
      });

      it('SHOULD parse arbitrary height "h-[50vh]"', () => {
        const result = converter.tailwindToCss('h-[50vh]');
        expect(result.css.sizing?.height).toBe('50vh');
      });
    });

    describe('WHEN parsing grid classes', () => {
      it('SHOULD parse "grid-flow-row" to grid-auto-flow: row', () => {
        const result = converter.tailwindToCss('grid-flow-row');
        expect(result.css.flexboxGrid?.gridAutoFlow).toBe('row');
      });

      it('SHOULD parse "grid-flow-col" to grid-auto-flow: column', () => {
        const result = converter.tailwindToCss('grid-flow-col');
        expect(result.css.flexboxGrid?.gridAutoFlow).toBe('column');
      });

      it('SHOULD parse arbitrary grid-cols "grid-cols-[1fr_1fr]"', () => {
        const result = converter.tailwindToCss('grid-cols-[1fr_1fr]');
        expect(result.css.flexboxGrid?.gridTemplateColumns).toBe('1fr 1fr');
      });

      it('SHOULD parse arbitrary grid-rows "grid-rows-[1fr_2fr]"', () => {
        const result = converter.tailwindToCss('grid-rows-[1fr_2fr]');
        expect(result.css.flexboxGrid?.gridTemplateRows).toBe('1fr 2fr');
      });

      it('SHOULD convert underscores back to spaces in arbitrary grid values', () => {
        const result = converter.tailwindToCss('grid-cols-[1fr_2fr_1fr]');
        expect(result.css.flexboxGrid?.gridTemplateColumns).toBe('1fr 2fr 1fr');
      });
    });

    describe('WHEN parsing unsupported classes', () => {
      it('SHOULD mark color classes as unsupported', () => {
        const result = converter.tailwindToCss('bg-blue-500');
        expect(result.unsupportedClasses).toContain('bg-blue-500');
        expect(Object.keys(result.css)).toHaveLength(0);
      });

      it('SHOULD mark text color classes as unsupported', () => {
        const result = converter.tailwindToCss('text-white');
        expect(result.unsupportedClasses).toContain('text-white');
      });

      it('SHOULD mark responsive variants as unsupported', () => {
        const result = converter.tailwindToCss('md:flex');
        expect(result.unsupportedClasses).toContain('md:flex');
        expect(result.css.layout?.display).toBeUndefined();
      });

      it('SHOULD mark state variants as unsupported', () => {
        const result = converter.tailwindToCss('hover:bg-blue-500');
        expect(result.unsupportedClasses).toContain('hover:bg-blue-500');
      });

      it('SHOULD mark dark mode variants as unsupported', () => {
        const result = converter.tailwindToCss('dark:bg-gray-900');
        expect(result.unsupportedClasses).toContain('dark:bg-gray-900');
      });

      it('SHOULD mark directional spacing as unsupported', () => {
        const result = converter.tailwindToCss('px-4');
        expect(result.unsupportedClasses).toContain('px-4');
      });

      it('SHOULD mark typography classes as unsupported', () => {
        const result = converter.tailwindToCss('text-lg font-bold');
        expect(result.unsupportedClasses).toContain('text-lg');
        expect(result.unsupportedClasses).toContain('font-bold');
      });
    });

    describe('WHEN parsing multiple classes', () => {
      it('SHOULD parse all supported classes in a string', () => {
        const result = converter.tailwindToCss('flex justify-center items-center gap-4');

        expect(result.css.layout?.display).toBe('flex');
        expect(result.css.flexboxGrid?.justifyContent).toBe('center');
        expect(result.css.flexboxGrid?.alignItems).toBe('center');
        expect(result.css.flexboxGrid?.gap).toBe('1rem');
        expect(result.unsupportedClasses).toHaveLength(0);
      });

      it('SHOULD separate supported and unsupported classes', () => {
        const result = converter.tailwindToCss('flex bg-blue-500 gap-4 text-white');

        expect(result.css.layout?.display).toBe('flex');
        expect(result.css.flexboxGrid?.gap).toBe('1rem');
        expect(result.unsupportedClasses).toContain('bg-blue-500');
        expect(result.unsupportedClasses).toContain('text-white');
      });

      it('SHOULD handle extra whitespace between classes', () => {
        const result = converter.tailwindToCss('  flex    gap-4   items-center  ');

        expect(result.css.layout?.display).toBe('flex');
        expect(result.css.flexboxGrid?.gap).toBe('1rem');
        expect(result.css.flexboxGrid?.alignItems).toBe('center');
      });
    });

    describe('WHEN parsing conflicting classes', () => {
      it('SHOULD use last value when multiple classes set same property', () => {
        const result = converter.tailwindToCss('flex grid');
        // Last class wins
        expect(result.css.layout?.display).toBe('grid');
      });

      it('SHOULD use last gap value when multiple gap classes present', () => {
        const result = converter.tailwindToCss('gap-2 gap-4');
        expect(result.css.flexboxGrid?.gap).toBe('1rem');
      });
    });
  });

  describe('bidirectional consistency', () => {
    describe('WHEN round-tripping CSS through Tailwind and back', () => {
      it('SHOULD preserve display: flex', () => {
        const originalCss: Css = { layout: { display: 'flex' } };
        const tailwind = converter.cssToTailwind(originalCss);
        const result = converter.tailwindToCss(tailwind.join(' '));

        expect(result.css.layout?.display).toBe('flex');
      });

      it('SHOULD preserve complex CSS through round-trip', () => {
        const originalCss: Css = {
          layout: { display: 'flex' },
          flexboxGrid: {
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
          },
        };

        const tailwind = converter.cssToTailwind(originalCss);
        const result = converter.tailwindToCss(tailwind.join(' '));

        expect(result.css.layout?.display).toBe('flex');
        expect(result.css.flexboxGrid?.justifyContent).toBe('center');
        expect(result.css.flexboxGrid?.alignItems).toBe('center');
        expect(result.css.flexboxGrid?.gap).toBe('1rem');
      });
    });

    describe('WHEN round-tripping Tailwind through CSS and back', () => {
      it('SHOULD preserve basic class string', () => {
        const original = 'flex justify-center items-center';
        const result = converter.tailwindToCss(original);
        const tailwind = converter.cssToTailwind(result.css as Css);

        expect(tailwind).toContain('flex');
        expect(tailwind).toContain('justify-center');
        expect(tailwind).toContain('items-center');
      });

      it('SHOULD preserve gap-4 class', () => {
        const original = 'gap-4';
        const result = converter.tailwindToCss(original);
        const tailwind = converter.cssToTailwind(result.css as Css);

        expect(tailwind).toContain('gap-4');
      });
    });
  });
});
