import {
  Component,
  input,
  output,
  effect,
  ElementRef,
  viewChild,
  ChangeDetectionStrategy,
  forwardRef,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorView, keymap, placeholder as placeholderExtension } from '@codemirror/view';
import { EditorState, Extension, Compartment } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';

@Component({
  selector: 'shared-code-editor',
  standalone: true,
  template: `
    <div #editorContainer class="code-editor-container"></div>
  `,
  styles: `
    .code-editor-container {
      border: 1px solid var(--border-color);
      border-radius: 6px;
      overflow: hidden;

      :global(.cm-editor) {
        background: var(--surface-ground);
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 13px;
      }

      :global(.cm-content) {
        padding: 8px 4px;
        min-height: 32px;
      }

      :global(.cm-line) {
        padding: 0 8px;
      }

      :global(.cm-focused) {
        outline: none;
      }

      :global(.cm-editor.cm-focused) {
        border-color: var(--primary-color);
      }

      :global(.cm-placeholder) {
        color: var(--text-color-secondary);
        font-style: italic;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeEditorComponent),
      multi: true,
    },
  ],
})
export class CodeEditorComponent implements ControlValueAccessor {
  editorContainer = viewChild.required<ElementRef<HTMLDivElement>>('editorContainer');

  placeholder = input<string>('');
  multiline = input<boolean>(false);
  extensions = input<Extension[]>([]);

  valueChange = output<string>();

  private editorView: EditorView | null = null;
  private disabled = signal(false);
  private editableCompartment = new Compartment();

  // ControlValueAccessor
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      const container = this.editorContainer();
      if (container) {
        this.initializeEditor();
      }
    });
  }

  private initializeEditor() {
    if (this.editorView) {
      this.editorView.destroy();
    }

    const container = this.editorContainer().nativeElement;

    const baseExtensions: Extension[] = [
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const value = update.state.doc.toString();
          this.onChange(value);
          this.valueChange.emit(value);
        }
      }),
      this.editableCompartment.of(EditorView.editable.of(!this.disabled())),
    ];

    // Add placeholder if provided
    if (this.placeholder()) {
      baseExtensions.push(placeholderExtension(this.placeholder()));
    }

    // Add line wrapping for single-line mode
    if (!this.multiline()) {
      baseExtensions.push(
        EditorView.lineWrapping,
        keymap.of([
          {
            key: 'Enter',
            run: () => true, // Prevent Enter key in single-line mode
          },
        ])
      );
    }

    // Add custom extensions
    baseExtensions.push(...this.extensions());

    this.editorView = new EditorView({
      state: EditorState.create({
        doc: '',
        extensions: baseExtensions,
      }),
      parent: container,
    });
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (this.editorView) {
      const currentValue = this.editorView.state.doc.toString();
      if (value !== currentValue) {
        this.editorView.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value || '',
          },
        });
      }
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    if (this.editorView) {
      this.editorView.dispatch({
        effects: this.editableCompartment.reconfigure(EditorView.editable.of(!isDisabled)),
      });
    }
  }
}
