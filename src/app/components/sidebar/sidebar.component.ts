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

    {
      title: 'Usuarios',
      expanded: false,
      children: [
        { title: 'Usuarios', route: '/usuario' },
        { title: 'Roles', route: '/rol' },
        { title: 'Permisos', route: '/permiso' },
      ],
    },
    {
      title: 'Obras',
      expanded: false,
      children: [
        { title: 'Obras', route: '/obra-civil' },
        { title: 'Tareas', route: '/tarea' },
      ],
    },
    {
      title: 'Recursos',
      expanded: false,
      children: [
        { title: 'Servicios', route: '/servicio' },
        { title: 'Empleados', route: '/empleado' },
      ],
    },
    {
      title: 'Compras',
      expanded: false,
      children: [],
    },
    {
      title: 'Sistema',
      expanded: false,
      children: [
        { title: 'Bitacora', route: '/bitacora' },
        { title: 'Backup y Restore', route: '/backup-restore' },
      ],
    }
  ];

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

  toggleMenu(menu: any) {
    menu.expanded = !menu.expanded;
  }
}
