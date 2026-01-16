import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'shared-copy-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Tooltip],
  template: `
    <p-button
      [icon]="copyButtonIcon()"
      (onClick)="copyToClipboard()"
      [pTooltip]="copyButtonLabel()"
      severity="secondary"
      [text]="true"
      size="small"
    />
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class CopyButtonComponent {
  content = input.required<string>();

  protected copyButtonLabel = signal('Copy');
  protected copyButtonIcon = signal('pi pi-copy');

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.content());
      this.copyButtonLabel.set('Copied!');
      this.copyButtonIcon.set('pi pi-check');

      setTimeout(() => {
        this.copyButtonLabel.set('Copy');
        this.copyButtonIcon.set('pi pi-copy');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
}
