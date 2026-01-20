import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  output,
  input,
  effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Tooltip } from 'primeng/tooltip';
import { DocumentListItem } from '@layout/persistence';
import { DocumentService } from '../core/services/document.service';

@Component({
  selector: 'app-document-browser',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, Button, InputText, FormsModule, ConfirmDialog, Tooltip],
  providers: [ConfirmationService],
  templateUrl: './document-browser.component.html',
  styleUrl: './document-browser.component.scss',
})
export class DocumentBrowserComponent {
  private documentService = inject(DocumentService);
  private confirmationService = inject(ConfirmationService);

  visible = input.required<boolean>();
  visibleChange = output<boolean>();
  documentOpened = output<void>();

  protected documents = toSignal(this.documentService.getDocuments(), {
    initialValue: [],
  });
  protected editingId = signal<string | null>(null);
  protected editingName = signal<string>('');

  constructor() {
    // Reset editing state when dialog closes
    effect(() => {
      if (!this.visible()) {
        this.editingId.set(null);
      }
    });
  }

  protected close(): void {
    this.visibleChange.emit(false);
  }

  protected async openDocument(doc: DocumentListItem): Promise<void> {
    // Don't open if we're editing this document's name
    if (this.editingId() === doc.id) {
      return;
    }

    await this.documentService.openDocument(doc.id);
    this.documentOpened.emit();
    this.close();
  }

  protected startRename(doc: DocumentListItem, event: Event): void {
    event.stopPropagation();
    this.editingId.set(doc.id);
    this.editingName.set(doc.name);
  }

  protected async saveRename(): Promise<void> {
    const id = this.editingId();
    const name = this.editingName().trim();

    if (id && name) {
      await this.documentService.renameDocument(id, name);
    }

    this.editingId.set(null);
  }

  protected cancelRename(): void {
    this.editingId.set(null);
  }

  protected confirmDelete(doc: DocumentListItem, event: Event): void {
    event.stopPropagation();
    this.confirmationService.confirm({
      message: `Delete "${doc.name}"? This cannot be undone.`,
      header: 'Delete Document',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.documentService.deleteDocument(doc.id),
    });
  }

  protected formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  protected onKeydown(event: KeyboardEvent, doc: DocumentListItem): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openDocument(doc);
    }
  }
}
