import { Routes } from '@angular/router';
import {PreviewComponent} from "./preview/preview.component";
import {TutorialComponent} from "./learn/tutorial.component";
import {DesignerComponent} from "./design/designer.component";
import {PlayComponent} from "./play/play.component";

export const routes: Routes = [
  {path: 'designer', component: DesignerComponent},
  {path: 'preview', component: PreviewComponent},
  {path: 'tutorial', component: TutorialComponent},
  {path: 'play', component: PlayComponent},
  {path: '', redirectTo: 'designer', pathMatch: 'full'}
];
