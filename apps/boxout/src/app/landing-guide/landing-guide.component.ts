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
    'data-testid': 'landing-guide',
  },
  templateUrl: './landing-guide.component.html',
  styleUrl: './landing-guide.component.scss',
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
