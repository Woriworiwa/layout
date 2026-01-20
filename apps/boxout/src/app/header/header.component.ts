import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  viewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { SplitButton } from 'primeng/splitbutton';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { Button, ButtonDirective } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ThemeConfiguratorComponent } from '../core/theme/theme-configurator.component';
import { ThemeService } from '../core/theme/theme.service';
import { Popover } from 'primeng/popover';
import { Dialog } from 'primeng/dialog';
import { RendererComponent } from '@layout/renderer';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputText } from 'primeng/inputtext';
import { DocumentService } from '../core/services/document.service';
import { DocumentBrowserComponent } from '../document-browser/document-browser.component';
import { GuideService } from '../core/services/guide.service';

@Component({
  selector: 'app-header',
  imports: [
    Button,
    FormsModule,
    Tooltip,
    SplitButtonModule,
    ThemeConfiguratorComponent,
    Popover,
    Dialog,
    RendererComponent,
    BlockUIModule,
    ButtonDirective,
    ConfirmDialog,
    InputText,
    DocumentBrowserComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: `./header.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private messageService = inject(MessageService);
  private themeService = inject(ThemeService);
  private confirmationService = inject(ConfirmationService);
  protected documentService = inject(DocumentService);
  private guideService = inject(GuideService);

  protected isPreviewVisible = signal<boolean>(false);
  protected isDocumentBrowserVisible = signal<boolean>(false);
  protected isSaveAsDialogVisible = signal<boolean>(false);
  protected saveAsName = signal<string>('');
  protected isEditingName = signal<boolean>(false);
  protected editedName = signal<string>('');

  protected nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  protected logoSrc = computed(() =>
    this.themeService.config().darkMode
      ? '../../../assets/logo-dark.svg'
      : '../../../assets/logo.svg'
  );

  protected documentTitle = computed(() => {
    const name = this.documentService.documentName();
    const dirty = this.documentService.isDirty();
    return dirty ? `${name} *` : name;
  });

  async handleNew(): Promise<void> {
    if (this.documentService.isDirty()) {
      this.confirmDiscardChanges(() => {
        this.documentService.newDocument();
        this.showMessage('info', 'New document created');
      });
    } else {
      this.documentService.newDocument();
      this.guideService.resetGuide();
      this.showMessage('info', 'New document created');
    }
  }

  handleOpen(): void {
    if (this.documentService.isDirty()) {
      this.confirmDiscardChanges(() => {
        this.isDocumentBrowserVisible.set(true);
      });
    } else {
      this.isDocumentBrowserVisible.set(true);
    }
  }

  async handleSave(): Promise<void> {
    if (this.documentService.isNewDocument()) {
      // New document - show Save As dialog
      this.saveAsName.set(this.documentService.documentName());
      this.isSaveAsDialogVisible.set(true);
      return;
    }

    await this.documentService.save();
    this.showMessage('success', `"${this.documentService.documentName()}" saved`);
  }

  async confirmSaveAs(): Promise<void> {
    const name = this.saveAsName().trim();
    if (!name) {
      return;
    }

    await this.documentService.saveAs(name);
    this.isSaveAsDialogVisible.set(false);
    this.showMessage('success', `"${name}" saved`);
  }

  cancelSaveAs(): void {
    this.isSaveAsDialogVisible.set(false);
  }

  onDocumentOpened(): void {
    this.showMessage('info', `Opened "${this.documentService.documentName()}"`);
  }

  protected startEditingName(): void {
    this.editedName.set(this.documentService.documentName());
    this.isEditingName.set(true);

    // Use setTimeout to allow the input to render before focusing
    setTimeout(() => {
      const input = this.nameInput()?.nativeElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  protected confirmNameEdit(): void {
    const trimmedName = this.editedName().trim();
    if (trimmedName && trimmedName !== this.documentService.documentName()) {
      this.documentService.rename(trimmedName);
      this.showSavedToast();
    }
    this.isEditingName.set(false);
  }

  protected cancelNameEdit(): void {
    this.isEditingName.set(false);
  }

  private showSavedToast(): void {
    this.messageService.add({
      severity: 'success',
      detail: 'Saved',
      life: 2000,
    });
  }

  private confirmDiscardChanges(onConfirm: () => void): void {
    this.confirmationService.confirm({
      message: 'You have unsaved changes. Discard them?',
      header: 'Unsaved Changes',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Discard',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: onConfirm,
    });
  }

  private showMessage(
    severity: 'success' | 'info' | 'warn' | 'error',
    detail: string
  ): void {
    this.messageService.add({
      severity,
      summary: severity === 'success' ? 'Success' : 'Info',
      detail,
    });
  }
}
