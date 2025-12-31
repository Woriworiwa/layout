import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UiGuidance, GuidanceEvent as BaseGuidanceEvent } from '@layout/shared';

export interface GuidanceEvent extends BaseGuidanceEvent {
  target: 'layers-panel-panel';
  action: 'highlight';
}

@Injectable({
  providedIn: 'root',
})
export class UiGuidanceService implements UiGuidance {
  private guidanceEventSubject = new Subject<GuidanceEvent>();

  guidanceEvent$ = this.guidanceEventSubject.asObservable();

  /**
   * Trigger a guidance event to highlight the layers-panel panel
   * This is called when user attempts to drag canvas elements
   */
  highlightLayersPanel(): void {
    this.guidanceEventSubject.next({
      target: 'layers-panel-panel',
      action: 'highlight',
    });
  }
}
