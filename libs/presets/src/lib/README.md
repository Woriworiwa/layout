# Presets Directory

This directory contains all the preset definitions for the layout generator, organized by category.

## File Structure

Files are named after their preset IDs for easy identification:

## Adding New Presets

1. Choose the appropriate category file or create a new one
2. Add your preset following the existing structure:
   ```typescript
   {
     "presetId": "unique-id",
     "presetName": "Display Name",
     "presetDefinition": {
       "itemType": "FLEX" | "TEXT",
       "css": { /* CSS properties-panel */ },
       "children": [ /* child elements */ ]
     }
   }
   ```
   
4. Add the new category to the `flexPresets` array in `index.ts`
