import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NbButtonModule, NbLayoutModule, NbSidebarModule, NbThemeModule, NbThemeService} from "@nebular/theme";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NbButtonModule, NbLayoutModule, NbSidebarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'layout';
}
