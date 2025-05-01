import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  menus = [
    { title: 'Home', route: '/', expanded: false, children: [] },

    { title: 'Gestionar Usuarios', expanded: false, children: [
      { title: 'Usuario', route: '/usuario' },
      { title: 'Rol', route: '/rol' },
      { title: 'Permiso', route: '/permiso' },
      { title: 'Bitacora', route: '/bitacora' },
      { title: 'Tarea', route: '/tarea' },
    ]},
    { title: 'Gestionar Inventario', expanded: false, children: [
    ]},
    { title: 'Gestionar Obras', expanded: false, children: [
    ]},
    /*{ title: 'Modelos', expanded: false, children: [
      { title: 'Persona', route: '/persona' },
      { title: 'Auto', route: '/auto' },
      { title: 'Perro', route: '/perro' },
    ]}/*,
    { title: 'Menú 2', expanded: false, children: [
      { title: 'Persona', route: '/persona' },
      { title: 'Settings', route: '/persona/settings' }
    ]},
    { title: 'Menú 3', expanded: false, children: [
      { title: 'Persona', route: '/persona' },
      { title: 'Settings', route: '/persona/settings' }
    ]}*/

  ];

  toggleMenu(menu: any) {
    menu.expanded = !menu.expanded;
  }
}
