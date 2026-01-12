import { describe, it, expect, beforeEach } from 'vitest';
import { PresetService } from './preset.service';
import { CanvasItem, CanvasItemType, PresetCategory } from '@layout/models';
import { PresetContainerComponent } from './components/preset-container.component';
import { PresetTextComponent } from './components/preset-text.component';

describe('PresetService', () => {
  let service: PresetService;

  beforeEach(() => {
    service = new PresetService();
    // Mock allPresets with test data
    service.allPresets = [
      {
        presetId: 'text-1',
        presetName: 'Text',
        category: PresetCategory.ROOT,
        presetDefinition: {
          itemType: CanvasItemType.TEXT,
          content: 'Sample text',
        },
      },
      {
        presetId: 'flex-1',
        presetName: 'Flex Row',
        category: PresetCategory.FLEXBOX,
        presetDefinition: {
          itemType: CanvasItemType.CONTAINER,
          css: { layout: { display: 'flex' } },
        },
      },
      {
        presetId: 'grid-1',
        presetName: 'Grid Basic',
        category: PresetCategory.GRID,
        presetDefinition: {
          itemType: CanvasItemType.CONTAINER,
          css: { layout: { display: 'grid' } },
        },
      },
      {
        presetId: 'layout-1',
        presetName: 'Holy Grail',
        category: PresetCategory.LAYOUTS,
        presetDefinition: {
          itemType: CanvasItemType.CONTAINER,
        },
      },
      {
        presetId: 'component-1',
        presetName: 'Card',
        category: PresetCategory.COMPONENTS,
        presetDefinition: {
          itemType: CanvasItemType.CONTAINER,
        },
      },
    ];
  });

  describe('WHEN getting asset component by type', () => {
    it('SHOULD return PresetContainerComponent for CONTAINER type', () => {
      const component = service.getAssetComponent(CanvasItemType.CONTAINER);

      expect(component).toBe(PresetContainerComponent);
    });

    it('SHOULD return PresetTextComponent for TEXT type', () => {
      const component = service.getAssetComponent(CanvasItemType.TEXT);

      expect(component).toBe(PresetTextComponent);
    });

    it('SHOULD return PresetContainerComponent for unknown type', () => {
      const component = service.getAssetComponent('UNKNOWN' as CanvasItemType);

      expect(component).toBe(PresetContainerComponent);
    });
  });

  describe('WHEN getting preset by ID', () => {
    it('SHOULD return preset when ID exists', () => {
      const preset = service.getPreset('text-1');

      expect(preset).toBeDefined();
      expect(preset?.presetId).toBe('text-1');
      expect(preset?.presetName).toBe('Text');
    });

    it('SHOULD return undefined when ID does not exist', () => {
      const preset = service.getPreset('non-existent');

      expect(preset).toBeUndefined();
    });
  });

  describe('WHEN assigning default paddings', () => {
    it('SHOULD add padding to CONTAINER type items', () => {
      const item: CanvasItem = {
        key: 'container-1',
        itemType: CanvasItemType.CONTAINER,
        css: {},
        children: [],
      };

      service.assignDefaultPaddings(item);

      expect(item.css?.spacing?.padding).toBe('16px');
    });

    it('SHOULD not modify non-CONTAINER items', () => {
      const item: CanvasItem = {
        key: 'text-1',
        itemType: CanvasItemType.TEXT,
        css: {},
        children: [],
      };

      service.assignDefaultPaddings(item);

      expect(item.css?.spacing?.padding).toBeUndefined();
    });

    it('SHOULD recursively assign padding to nested containers', () => {
      const item: CanvasItem = {
        key: 'parent',
        itemType: CanvasItemType.CONTAINER,
        css: {},
        children: [
          {
            key: 'child-1',
            itemType: CanvasItemType.CONTAINER,
            css: {},
            children: [],
          },
          {
            key: 'child-2',
            itemType: CanvasItemType.TEXT,
            css: {},
            children: [],
          },
        ],
      };

      service.assignDefaultPaddings(item);

      expect(item.css?.spacing?.padding).toBe('16px');
      expect(item.children?.[0].css?.spacing?.padding).toBe('16px');
      expect(item.children?.[1].css?.spacing?.padding).toBeUndefined();
    });

    it('SHOULD preserve existing CSS properties-panel when adding padding', () => {
      const item: CanvasItem = {
        key: 'container-1',
        itemType: CanvasItemType.CONTAINER,
        css: {
          layout: { display: 'flex' },
          sizing: { width: '10px' },
        },
        children: [],
      };

      service.assignDefaultPaddings(item);

      expect(item.css?.spacing?.padding).toBe('16px');
      expect(item.css?.sizing?.width).toBe('10px');
      expect(item.css?.layout?.display).toBe('flex');
    });
  });

  describe('WHEN getting preset folders', () => {
    it('SHOULD return root presets and organized folders', () => {
      const result = service.getPresetFolders();

      expect(result.rootPresets).toHaveLength(1);
      expect(result.rootPresets[0].presetId).toBe('text-1');
      expect(result.folders).toHaveLength(4);
    });

    it('SHOULD organize presets by category', () => {
      const result = service.getPresetFolders();

      const flexFolder = result.folders.find((f) => f.id === PresetCategory.FLEXBOX);
      const gridFolder = result.folders.find((f) => f.id === PresetCategory.GRID);

      expect(flexFolder?.presets).toHaveLength(1);
      expect(flexFolder?.presets[0].presetId).toBe('flex-1');
      expect(gridFolder?.presets).toHaveLength(1);
      expect(gridFolder?.presets[0].presetId).toBe('grid-1');
    });

    it('SHOULD assign correct labels to folders', () => {
      const result = service.getPresetFolders();

      const flexFolder = result.folders.find((f) => f.id === PresetCategory.FLEXBOX);
      const gridFolder = result.folders.find((f) => f.id === PresetCategory.GRID);
      const layoutsFolder = result.folders.find((f) => f.id === PresetCategory.LAYOUTS);
      const componentsFolder = result.folders.find((f) => f.id === PresetCategory.COMPONENTS);

      expect(flexFolder?.label).toBe('Flexbox');
      expect(gridFolder?.label).toBe('Grid');
      expect(layoutsFolder?.label).toBe('Layouts');
      expect(componentsFolder?.label).toBe('Components');
    });

    it('SHOULD assign correct icons to folders', () => {
      const result = service.getPresetFolders();

      const flexFolder = result.folders.find((f) => f.id === PresetCategory.FLEXBOX);
      const gridFolder = result.folders.find((f) => f.id === PresetCategory.GRID);
      const layoutsFolder = result.folders.find((f) => f.id === PresetCategory.LAYOUTS);
      const componentsFolder = result.folders.find((f) => f.id === PresetCategory.COMPONENTS);

      expect(flexFolder?.icon).toBe('pi pi-directions');
      expect(gridFolder?.icon).toBe('pi pi-th-large');
      expect(layoutsFolder?.icon).toBe('pi pi-window-maximize');
      expect(componentsFolder?.icon).toBe('pi pi-box');
    });

    it('SHOULD sort folders in the correct order', () => {
      const result = service.getPresetFolders();

      expect(result.folders[0].id).toBe(PresetCategory.FLEXBOX);
      expect(result.folders[1].id).toBe(PresetCategory.GRID);
      expect(result.folders[2].id).toBe(PresetCategory.LAYOUTS);
      expect(result.folders[3].id).toBe(PresetCategory.COMPONENTS);
    });
  });
});
