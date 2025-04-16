import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PermisoService } from '../../../../services/permiso/permiso.service';
import { Permiso } from '../../../../models/permiso/permiso.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-permiso-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permiso-create.component.html',
  styleUrl: './permiso-create.component.scss',
})
export class PermisoCreateComponent {
  permiso: Permiso = { id: 0, nombre: '', descripcion: '' };

  submitted = false;

  constructor(
    private permisoService: PermisoService,
    private router: Router // Inyectamos el servicio de router
  ) {}

  // Función para crear Permiso
  crearPermiso(): void {
    this.permisoService.crearPermiso(this.permiso).subscribe(() => {
      this.router.navigate(['/permiso']); // Redirige al componente principal después de crear
    });
  }

  // Función para cancelar y volver a la lista de personas
  cancelar(): void {
    this.router.navigate(['/permiso']); // Redirige a la lista de personas
  }
}
