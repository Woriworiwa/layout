/**
 * Interface for preview theme configuration.
 * Each theme defines complete CSS styles for distinct visual aesthetics.
 */
export interface PreviewTheme {
  id: string;
  label: string;
  description: string;
  /** CSS styles for the preview body/root */
  bodyStyles: string;
  /** CSS styles for .frame elements (containers) */
  frameStyles: string;
  /** CSS styles for .text elements */
  textStyles: string;
  /** Optional additional CSS for unique effects */
  additionalStyles?: string;
}

/**
 * Predefined visual style themes for the renderer preview.
 */
export const previewThemes: PreviewTheme[] = [
  {
    id: 'prototype',
    label: 'Prototype',
    description: 'Wireframe-style for early design exploration',
    bodyStyles: `
      background-color: #f5f5f5;
      background-image:
        linear-gradient(rgba(0,0,0,.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px);
      background-size: 20px 20px;
      font-family: 'Courier New', monospace;
    `,
    frameStyles: `
      padding: 16px;
      background-color: #ffffff;
      border: 2px dashed #9ca3af;
      border-radius: 4px;
      position: relative;
    `,
    textStyles: `
      padding: 8px 12px;
      background-color: #e5e7eb;
      border: 1px solid #9ca3af;
      border-radius: 2px;
      color: #374151;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    `,
    additionalStyles: `
      .frame::before {
        content: 'Container';
        position: absolute;
        top: -10px;
        left: 8px;
        background: #f5f5f5;
        padding: 0 4px;
        font-size: 10px;
        color: #6b7280;
        font-family: 'Courier New', monospace;
      }
    `,
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    description: 'Polished product card style',
    bodyStyles: `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', system-ui, sans-serif;
      padding: 20px;
    `,
    frameStyles: `
      padding: 20px;
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -2px rgba(0, 0, 0, 0.1),
        0 20px 25px -5px rgba(0, 0, 0, 0.15);
      border: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    `,
    textStyles: `
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(102, 126, 234, 0.4);
      border: none;
    `,
    additionalStyles: `
      .frame:hover {
        transform: translateY(-2px);
        box-shadow:
          0 8px 12px -2px rgba(0, 0, 0, 0.15),
          0 4px 8px -2px rgba(0, 0, 0, 0.1),
          0 25px 30px -5px rgba(0, 0, 0, 0.2);
      }
    `,
  },
  {
    id: 'tutorial',
    label: 'Tutorial',
    description: 'Educational style with callouts',
    bodyStyles: `
      background-color: #fffbeb;
      font-family: 'Georgia', serif;
    `,
    frameStyles: `
      padding: 20px;
      padding-left: 24px;
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      border-radius: 0 8px 8px 0;
      position: relative;
      margin-left: 8px;
    `,
    textStyles: `
      padding: 10px 16px;
      background-color: #ffffff;
      border: 2px solid #fbbf24;
      border-radius: 6px;
      color: #92400e;
      font-size: 15px;
      line-height: 1.6;
      position: relative;
    `,
    additionalStyles: `
      .frame::before {
        content: '📌';
        position: absolute;
        left: -16px;
        top: 16px;
        font-size: 20px;
      }
      .text::after {
        content: '💡';
        margin-left: 8px;
      }
    `,
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Clean and simple design',
    bodyStyles: `
      background-color: #fafafa;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `,
    frameStyles: `
      padding: 24px;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 2px;
    `,
    textStyles: `
      padding: 12px 16px;
      background-color: #171717;
      color: #ffffff;
      border-radius: 2px;
      font-size: 14px;
      font-weight: 500;
      border: none;
    `,
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Dark analytics dashboard style',
    bodyStyles: `
      background-color: #0f172a;
      font-family: 'Inter', system-ui, sans-serif;
    `,
    frameStyles: `
      padding: 20px;
      background-color: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    `,
    textStyles: `
      padding: 10px 16px;
      background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
      color: #ffffff;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      border: none;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `,
    additionalStyles: `
      .frame {
        backdrop-filter: blur(8px);
      }
    `,
  },
];

/**
 * Default theme ID used when no theme is selected.
 */
export const DEFAULT_PREVIEW_THEME_ID = 'prototype';
