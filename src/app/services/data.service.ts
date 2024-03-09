import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  getTreeNodesData() {
    return [
      {
        key: '0',
        label: 'Desktop',
        data: 'Documents Folder',
        icon: 'pi pi-fw pi-inbox',
        children: [
          {
            key: '0-0',
            label: 'Stack frame',
            data: 'Work Folder',
            icon: 'pi pi-fw pi-cog',
            children: [
              { key: '0-0-0', label: 'div', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
              { key: '0-0-1', label: 'div', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
            ]
          },
          {
            key: '0-1',
            label: 'Grid frame',
            data: 'Home Folder',
            icon: 'pi pi-fw pi-home',
            children: [{ key: '0-1-0', label: 'div', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
          }
        ]
      }
    ];
  }

  getTreeNodes() {
    return Promise.resolve(this.getTreeNodesData());
  }
};
