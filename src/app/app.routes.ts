import { Routes } from '@angular/router';
import {DesignerComponent} from "./designer/designer.component";

export const routes: Routes = [
  {path: 'design', component: DesignerComponent},
  {path: 'preview', loadComponent: () => import('./renderer/renderer.component').then(c => c.RendererComponent)},
  {path: '', redirectTo: 'design', pathMatch: 'full'}
];
