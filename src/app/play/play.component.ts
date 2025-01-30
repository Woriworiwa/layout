import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppSkeletonComponent} from "../core/app.skeleton.component";

@Component({
  selector: 'app-play',
  imports: [CommonModule, AppSkeletonComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent {}
