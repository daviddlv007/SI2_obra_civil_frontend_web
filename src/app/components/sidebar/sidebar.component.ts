import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menus = [
    { title: 'Home', route: '/', expanded: false, children: [] },
    { title: 'Menú 1', expanded: false, children: [
      { title: 'Persona', route: '/persona' },
      { title: 'Auto', route: '/auto' },
      { title: 'Perro', route: '/perro' },
      { title: 'Rol', route: '/rol' },
    ]},
    { title: 'Menú 2', expanded: false, children: [
      { title: 'Persona', route: '/persona' },
      { title: 'Settings', route: '/persona/settings' }
    ]},
    { title: 'Menú 3', expanded: false, children: [
      { title: 'Persona', route: '/persona' },
      { title: 'Settings', route: '/persona/settings' }
    ]}
  ];

  toggleMenu(menu: any) {
    menu.expanded = !menu.expanded;
  }
}
