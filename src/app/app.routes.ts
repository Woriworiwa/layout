import { Routes } from '@angular/router';
import {CodeComponent} from "./code/code.component";
import {TutorialComponent} from "./learn/tutorial.component";
import {DesignerComponent} from "./design/designer.component";
import {PlayComponent} from "./play/play.component";

export const routes: Routes = [
  {path: 'designer', component: DesignerComponent},
  {path: 'preview', component: CodeComponent},
  {path: 'tutorial', component: TutorialComponent},
  {path: 'play', component: PlayComponent},
  {path: '', redirectTo: 'designer', pathMatch: 'full'}
];
