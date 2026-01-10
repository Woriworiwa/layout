import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

/**
 * VS Code style autocomplete theme
 * Matches the design from the screenshot
 */
export const autocompleteTheme = EditorView.theme({
  // Autocomplete tooltip container
  '.cm-tooltip-autocomplete': {
    backgroundColor: '#2d2d30',
    border: 'none',
    borderRadius: '0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
    padding: '0',
    maxHeight: '400px',
    minWidth: '500px',
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    fontSize: '13px',
  },

  // Scrollbar styling
  '.cm-tooltip-autocomplete::-webkit-scrollbar': {
    width: '10px',
  },
  '.cm-tooltip-autocomplete::-webkit-scrollbar-track': {
    background: '#1e1e1e',
  },
  '.cm-tooltip-autocomplete::-webkit-scrollbar-thumb': {
    background: '#424242',
    borderRadius: '0',
  },
  '.cm-tooltip-autocomplete::-webkit-scrollbar-thumb:hover': {
    background: '#4e4e4e',
  },

  // Individual completion items
  '.cm-tooltip-autocomplete ul': {
    listStyle: 'none',
    margin: 0,
    padding: '2px 0',
  },
  '.cm-tooltip-autocomplete ul li': {
    padding: '4px 8px',
    margin: '0',
    borderRadius: '0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'background-color 0.1s ease',
    fontSize: '13px',
    color: '#cccccc',
    lineHeight: '22px',
  },

  // Hover state
  '.cm-tooltip-autocomplete ul li:hover': {
    backgroundColor: '#2a2d2e',
  },

  // Selected/focused item
  '.cm-tooltip-autocomplete ul li[aria-selected="true"]': {
    backgroundColor: '#094771',
    color: '#ffffff',
  },

  // Completion label (the class name)
  '.cm-completionLabel': {
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    fontSize: '13px',
    fontWeight: 'normal',
    color: '#4fc1ff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Selected item label color
  '.cm-tooltip-autocomplete ul li[aria-selected="true"] .cm-completionLabel': {
    color: '#ffffff',
  },

  // Completion detail (the CSS value)
  '.cm-completionDetail': {
    fontSize: '13px',
    opacity: 0.5,
    marginLeft: 'auto',
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    fontStyle: 'normal',
    color: '#cccccc',
    paddingLeft: '16px',
    textAlign: 'right',
    flexShrink: '0',
  },

  // Selected item detail styling
  '.cm-tooltip-autocomplete ul li[aria-selected="true"] .cm-completionDetail': {
    opacity: 0.7,
    color: '#ffffff',
  },

  // Completion icons/types
  '.cm-completionIcon': {
    marginRight: '0',
    fontSize: '14px',
    width: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Keyword type (variants like hover:, focus:)
  '.cm-completionIcon-keyword::before': {
    content: '"~"',
    color: '#4ec9b0',
    fontWeight: 'bold',
  },

  // Property type (utility classes)
  '.cm-completionIcon-property::before': {
    content: '"~"',
    color: '#4ec9b0',
    fontWeight: 'bold',
  },

  // Info tooltip (shown on hover)
  '.cm-tooltip-autocomplete .cm-completionInfo': {
    backgroundColor: '#1e1e1e',
    border: '1px solid #454545',
    borderRadius: '3px',
    padding: '8px 12px',
    marginLeft: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
    maxWidth: '400px',
    fontSize: '13px',
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    color: '#cccccc',
  },

  // Match highlighting - make it bold
  '.cm-completionMatchedText': {
    fontWeight: 'bold',
    textDecoration: 'none',
  },
}, { dark: true });

/**
 * Light mode theme - VS Code light style
 */
export const autocompleteThemeLight = EditorView.theme({
  '.cm-tooltip-autocomplete': {
    backgroundColor: '#f3f3f3',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },

  '.cm-tooltip-autocomplete::-webkit-scrollbar-track': {
    background: '#e8e8e8',
  },
  '.cm-tooltip-autocomplete::-webkit-scrollbar-thumb': {
    background: '#c4c4c4',
  },
  '.cm-tooltip-autocomplete::-webkit-scrollbar-thumb:hover': {
    background: '#a6a6a6',
  },

  '.cm-tooltip-autocomplete ul': {
    listStyle: 'none',
    margin: 0,
    padding: '2px 0',
  },

  '.cm-tooltip-autocomplete ul li': {
    padding: '4px 8px',
    margin: '0',
    borderRadius: '0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'background-color 0.1s ease',
    fontSize: '13px',
    color: '#3b3b3b',
    lineHeight: '22px',
  },

  '.cm-tooltip-autocomplete ul li:hover': {
    backgroundColor: '#e8e8e8',
  },

  '.cm-tooltip-autocomplete ul li[aria-selected="true"]': {
    backgroundColor: '#0078d4',
    color: '#ffffff',
  },

  '.cm-completionLabel': {
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    fontSize: '13px',
    fontWeight: 'normal',
    color: '#0066bf',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  '.cm-tooltip-autocomplete ul li[aria-selected="true"] .cm-completionLabel': {
    color: '#ffffff',
  },

  '.cm-completionDetail': {
    fontSize: '13px',
    opacity: 0.5,
    marginLeft: 'auto',
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    fontStyle: 'normal',
    color: '#3b3b3b',
    paddingLeft: '16px',
    textAlign: 'right',
    flexShrink: '0',
  },

  '.cm-tooltip-autocomplete ul li[aria-selected="true"] .cm-completionDetail': {
    opacity: 0.7,
    color: '#ffffff',
  },

  // Completion icons/types
  '.cm-completionIcon': {
    marginRight: '0',
    fontSize: '14px',
    width: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  '.cm-completionIcon-keyword::before, .cm-completionIcon-property::before': {
    color: '#008080',
  },

  // Match highlighting - make it bold
  '.cm-completionMatchedText': {
    fontWeight: 'bold',
    textDecoration: 'none',
  },

  '.cm-tooltip-autocomplete .cm-completionInfo': {
    backgroundColor: '#ffffff',
    border: '1px solid #d0d0d0',
    color: '#3b3b3b',
  },
}, { dark: false });

/**
 * Get the appropriate theme based on dark mode
 */
export function getAutocompleteTheme(isDark: boolean): Extension {
  return isDark ? autocompleteTheme : autocompleteThemeLight;
}
