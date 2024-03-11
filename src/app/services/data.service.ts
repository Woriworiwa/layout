import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  getTreeNodesData() {
    const data = [
      {
        label: 'Desktop',
        data: 'Documents Folder',
        icon: 'pi pi-fw pi-inbox',
        children: [
          {
            label: 'Stack frame',
            data: 'Work Folder',
            icon: 'pi pi-fw pi-cog',
            children: [
              { label: 'div', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
              { label: 'div', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
            ]
          },
          {
            label: 'Grid frame',
            data: 'Home Folder',
            icon: 'pi pi-fw pi-home',
            children: [{ label: 'div', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
          }
        ]
      }
    ];

    data.forEach(((node, index) => this.assignKey(node, index)));
    return data;
  }

  assignKey(node: any, index: number, parentKey?: string | number) {
    node.key = parentKey != null ? `${parentKey}-${index}`: index;

    node.children?.forEach((child: any, index: number) => this.assignKey(child, index, node.key));
  }
};
