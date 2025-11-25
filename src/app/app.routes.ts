import { Routes } from '@angular/router';
import {DesignerComponent} from "./designer/designer.component";

export const routes: Routes = [
  {path: 'design', component: DesignerComponent},
  {path: 'preview', loadComponent: () => import('./renderer/preview.component').then(c => c.PreviewComponent)},
  {path: '', redirectTo: 'design', pathMatch: 'full'}
];
