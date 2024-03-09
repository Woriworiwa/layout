import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NbButtonModule, NbLayoutModule, NbSidebarModule, NbThemeModule, NbThemeService} from "@nebular/theme";
import {FrameComponent} from "./frame/frame.component";
import {PropertiesComponent} from "./properties/properties.component";
import {FrameService} from "./services/frame.service";
import {AsyncPipe} from "@angular/common";
import {FrameFlexComponent} from "./frame/frame.flex.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NbLayoutModule, NbSidebarModule, FrameComponent, PropertiesComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'layout';

  constructor(protected frameService: FrameService) {
  }
}
