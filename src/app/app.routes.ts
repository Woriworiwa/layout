import { Routes } from '@angular/router';
import {DesignerComponent} from "./design/designer.component";

export const routes: Routes = [
  {path: 'design', component: DesignerComponent},
  {path: 'preview', loadComponent: () => import('./preview/preview.component').then(c => c.PreviewComponent)},
  {path: 'learn', loadComponent: () => import('./learn/tutorial.component').then(c => c.TutorialComponent)},
  {path: 'play', loadComponent: () => import('./play/play.component').then(c => c.PlayComponent)},
  {path: '', redirectTo: 'design', pathMatch: 'full'}
];
