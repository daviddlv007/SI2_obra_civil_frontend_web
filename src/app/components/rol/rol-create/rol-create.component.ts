import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RolService } from '../../../services/rol/rol.service';
import { RolPermisoService } from '../../../services/rol-permiso/rol-permiso.service';
import { PermisoService } from '../../../services/permiso/permiso.service';
import { Rol } from '../../../models/rol/rol.model';
import { RolPermiso } from '../../../models/rol-permiso/rol-permiso.model';
import { Permiso } from '../../../models/permiso/permiso.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rol-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './rol-create.component.html',
  styleUrls: ['./rol-create.component.scss'],
})
export class RolCreateComponent implements OnInit {
  rol: Rol = { nombre: '', descripcion: '' };
  permisos: Permiso[] = [];
  selectedPermisos: Permiso[] = [];
  permisoSeleccionado: Permiso | null = null;

  constructor(
    private rolService: RolService,
    private permisoService: PermisoService,
    private rolPermisoService: RolPermisoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPermisos();
  }

  cargarPermisos(): void {
    this.permisoService.obtenerPermisos().subscribe(permisos => {
      this.permisos = permisos;
    });
  }

  addPermisoToSelected(permiso: Permiso | null): void {
    if (permiso) {
      this.selectedPermisos.push(permiso);
      this.permisos = this.permisos.filter(p => p.id !== permiso.id);
    }
    this.permisoSeleccionado = null;
  }

  removePermisoFromSelected(permiso: Permiso): void {
    this.selectedPermisos = this.selectedPermisos.filter(p => p.id !== permiso.id);
    this.permisos.push(permiso); // Se vuelve a agregar a la lista disponible
  }

  crearRol(): void {
    this.rolService.crearRol(this.rol).subscribe((nuevoRol) => {
      this.selectedPermisos.forEach((permiso) => {
        const rolPermiso: RolPermiso = {
          rol: { id: nuevoRol.id },
          permiso: { id: permiso.id },
        };
        this.rolPermisoService.crearRolPermiso(rolPermiso).subscribe();
      });
      this.router.navigate(['/rol']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/rol']);
  }
}