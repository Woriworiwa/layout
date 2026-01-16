import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Button } from 'primeng/button';

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-landing-guide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  host: {
    class: 'absolute inset-0 z-50 flex items-center justify-center p-8',
    style:
      'background: color-mix(in srgb, var(--p-surface-0) 90%, transparent); backdrop-filter: blur(8px);',
    'data-testid': 'landing-guide',
  },
  template: `
    <div class="flex flex-col items-center max-w-3xl w-full">
      <!-- Header -->
      <h1 class="text-2xl font-semibold mb-2 text-surface-900">
        What would you like to build?
      </h1>
      <p class="text-surface-500 mb-8">
        Choose a template to get started, or start with a blank canvas.
      </p>

      <!-- Template Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
        @for (template of templates; track template.id) {
          <button
            type="button"
            class="template-card group flex flex-col items-center p-4 rounded-lg border border-surface-200 bg-surface-0 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer text-center"
            (click)="onSelectTemplate(template.id)"
            [attr.data-testid]="'template-' + template.id"
          >
            <div
              class="w-16 h-16 rounded-lg bg-surface-100 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors"
            >
              <i
                class="pi text-2xl text-surface-500 group-hover:text-primary transition-colors"
                [class]="template.icon"
              ></i>
            </div>
            <span class="font-medium text-surface-800 mb-1">{{
              template.name
            }}</span>
            <span class="text-xs text-surface-500">{{
              template.description
            }}</span>
          </button>
        }
      </div>

      <!-- Start Blank -->
      <div class="flex items-center gap-3 text-surface-500">
        <span class="text-sm">or</span>
        <p-button
          label="Start with blank canvas"
          [link]="true"
          (onClick)="onStartBlank()"
          data-testid="start-blank-button"
        />
      </div>
    </div>
  `,
  styles: `
    .template-card:focus {
      outline: 2px solid var(--p-primary-color);
      outline-offset: 2px;
    }
  `,
})
export class LandingGuideComponent {
  readonly templateSelected = output<string>();
  readonly startBlank = output<void>();

  protected readonly templates: TemplateOption[] = [
    {
      id: 'sidebar-layout',
      name: 'Page Layout',
      description: 'Header, sidebar, content, footer',
      icon: 'pi-window-maximize',
    },
    {
      id: 'grid-3-columns',
      name: 'Card Grid',
      description: '3-column responsive grid',
      icon: 'pi-th-large',
    },
    {
      id: 'navbar',
      name: 'Navigation',
      description: 'Logo with nav links',
      icon: 'pi-bars',
    },
    {
      id: 'card',
      name: 'Card',
      description: 'Title, content, action',
      icon: 'pi-id-card',
    },
  ];

  protected onSelectTemplate(templateId: string): void {
    this.templateSelected.emit(templateId);
  }

  protected onStartBlank(): void {
    this.startBlank.emit();
  }
}
