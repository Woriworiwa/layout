import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appPropertyFilter',
  standalone: true
})
export class AppPropertyFilterPipe implements PipeTransform {
  transform(propertyName: string, searchText: string): boolean {
    if (!searchText) {
      return true;
    }

    searchText = searchText.toLocaleLowerCase();
    return propertyName.toLocaleLowerCase().includes(searchText);
  }
}
