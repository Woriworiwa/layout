import { Routes } from '@angular/router';
import {PreviewComponent} from "./preview/preview.component";
import {TutorialComponent} from "./learn/tutorial.component";
import {DesignerComponent} from "./design/designer.component";
import {PlayComponent} from "./play/play.component";

export const routes: Routes = [
  {path: 'design', component: DesignerComponent},
  {path: 'preview', component: PreviewComponent},
  {path: 'learn', component: TutorialComponent},
  {path: 'play', component: PlayComponent},
  {path: '', redirectTo: 'design', pathMatch: 'full'}
];
