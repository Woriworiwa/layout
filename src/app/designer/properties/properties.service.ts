import { Injectable, signal } from '@angular/core';

@Injectable()
export class PropertiesService {
  searchText = signal('');
}
