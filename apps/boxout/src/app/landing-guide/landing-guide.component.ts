import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-landing-guide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  host: {
    class: 'absolute inset-0 z-50 flex items-center justify-center',
    style:
      'background: color-mix(in srgb, var(--p-surface-0) 85%, transparent); backdrop-filter: blur(4px);',
    'data-testid': 'landing-guide',
  },
  template: `
    <div class="text-center max-w-lg px-8">
      <!-- Welcome Icon -->
      <div class="mb-6">
        <i class="pi pi-th-large text-6xl text-primary"></i>
      </div>

      <!-- Welcome Message -->
      <h1 class="text-3xl font-bold mb-4 text-surface-900">
        Welcome to BoxOut
      </h1>

      <p class="text-lg text-surface-600 mb-8">
        Create responsive CSS layouts visually using Grid and Flexbox. Drag
        components from the left panel to start building.
      </p>

      <!-- Tips Section -->
      <div class="text-left mb-8 p-4 surface-100 rounded-lg">
        <h3 class="font-semibold mb-3 text-surface-800">Quick Tips:</h3>
        <ul class="list-none p-0 m-0 flex flex-col gap-2 text-surface-600">
          <li class="flex items-start gap-2">
            <i class="pi pi-arrow-right text-primary mt-1"></i>
            <span>Drag assets from the left panel onto the canvas</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="pi pi-arrow-right text-primary mt-1"></i>
            <span>Click elements to select and edit properties</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="pi pi-arrow-right text-primary mt-1"></i>
            <span>Use the Inspector to view generated CSS and HTML</span>
          </li>
        </ul>
      </div>

      <!-- Get Started Button -->
      <p-button
        label="Get Started"
        icon="pi pi-arrow-right"
        iconPos="right"
        (onClick)="onGetStarted()"
        data-testid="get-started-button"
      />
    </div>
  `,
})
export class LandingGuideComponent {
  readonly getStarted = output<void>();

  protected onGetStarted(): void {
    this.getStarted.emit();
  }
}
