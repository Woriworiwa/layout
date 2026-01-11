import { describe, it, expect } from 'vitest';
import { AiSchemaGeneratorService } from './ai-schema-generator.service';
import {
  SPACING_PROPERTY_NAMES,
  SIZING_PROPERTY_NAMES,
  CONTAINER_PROPERTY_NAMES,
  LAYOUT_PROPERTY_NAMES,
} from '@layout/models';

describe('AiSchemaGeneratorService', () => {
  it('should generate a schema containing CONTAINER and TEXT item types', () => {
    const service = new AiSchemaGeneratorService();
    const schema = service.generateCanvasItemSchema();

    expect(schema).toContain('CanvasItem Schema');
    expect(schema).toContain('"CONTAINER"');
    expect(schema).toContain('"TEXT"');
    expect(schema).toContain('"display"');
    expect(schema).toContain('"container"');
  });

  it('should include all CSS properties from all interfaces in the schema', () => {
    const service = new AiSchemaGeneratorService();
    const schema = service.generateCanvasItemSchema();

    // Collect all property names from all interfaces
    const allProperties = [
      ...LAYOUT_PROPERTY_NAMES,
      ...CONTAINER_PROPERTY_NAMES,
      ...SPACING_PROPERTY_NAMES,
      ...SIZING_PROPERTY_NAMES,
    ];

    // Verify each property is present in the generated schema
    for (const prop of allProperties) {
      expect(schema).toContain(`"${prop}"`);
    }
  });

  it('should not throw when generating schemas for all property interfaces', () => {
    const service = new AiSchemaGeneratorService();

    // This will throw if any property is missing from PROPERTY_VALUE_MAP
    expect(() => {
      service.generateCanvasItemSchema();
    }).not.toThrow();
  });
});
