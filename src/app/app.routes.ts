import { Routes } from '@angular/router';
import {BuildComponent} from "./build/build.component";
import {TutorialComponent} from "./learn/tutorial.component";
import {DesignerComponent} from "./design/designer.component";
import {PlayComponent} from "./play/play.component";

export const routes: Routes = [
  {path: 'design', component: DesignerComponent},
  {path: 'build', component: BuildComponent},
  {path: 'learn', component: TutorialComponent},
  {path: 'play', component: PlayComponent},
  {path: '', redirectTo: 'design', pathMatch: 'full'}
];
