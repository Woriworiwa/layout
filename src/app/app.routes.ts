import { Routes } from '@angular/router';
import {PreviewComponent} from "./preview/preview.component";
import {TutorialComponent} from "./tutorial/tutorial.component";
import {DesignerComponent} from "./designer/designer.component";

export const routes: Routes = [
  {path: 'designer', component: DesignerComponent},
  {path: 'preview', component: PreviewComponent},
  {path: 'tutorial', component: TutorialComponent},
  {path: '', redirectTo: 'designer', pathMatch: 'full'}
];
