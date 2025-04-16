import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RolService } from '../../../services/rol/rol.service';
import { PermisoService } from '../../../services/permiso/permiso.service';
import { RolPermisoService } from '../../../services/rol-permiso/rol-permiso.service';
import { Rol } from '../../../models/rol/rol.model';
import { Permiso } from '../../../models/permiso/permiso.model';
import { RolPermiso } from '../../../models/rol-permiso/rol-permiso.model';

@Component({
  selector: 'app-rol-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './rol-update.component.html',
  styleUrls: ['./rol-update.component.scss'],
})
export class RolUpdateComponent implements OnInit {
  rol: Rol = { id: 0, nombre: '', descripcion: '' };
  permisos: Permiso[] = [];
  selectedPermisos: Permiso[] = [];
  permisoSeleccionado: Permiso | null = null;

  constructor(
    private rolService: RolService,
    private permisoService: PermisoService,
    private rolPermisoService: RolPermisoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.rolService.obtenerRolPorId(id).subscribe((data) => {
        this.rol = data;
  
        // Obtener las relaciones entre el rol y los permisos
        this.rolPermisoService.obtenerRolPermisos().subscribe((rolPermisos) => {
          // Filtrar las relaciones que corresponden al rol actual
          const permisosRelacionados = rolPermisos.filter(rp => rp.rol?.id === this.rol.id);
          
          // Agregar los permisos relacionados a selectedPermisos
          this.selectedPermisos = permisosRelacionados
            .map(rel => rel.permiso)
            .filter((permiso): permiso is Permiso => permiso !== undefined);
        
          // Filtrar los permisos que ya están vinculados al rol
          this.permisos = this.permisos.filter(permiso => 
            !this.selectedPermisos.some(selected => selected.id === permiso.id)
          );
        });
      });
    }
    this.cargarPermisos();
  }

  cargarPermisos(): void {
    this.permisoService.obtenerPermisos().subscribe((permisos) => {
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
    this.permisos.push(permiso);
  }

  actualizarRol(): void {
    if (this.rol.id) {
      this.rolService.actualizarRol(this.rol.id, this.rol).subscribe((updatedRol) => {
        // Obtener las relaciones existentes entre permisos y rol
        this.rolPermisoService.obtenerRolPermisos().subscribe((relacionesExistentes) => {
          // Eliminar las relaciones que ya no estén seleccionadas
          const idsRelacionadasExistentes = relacionesExistentes.filter(r => r.rol?.id === updatedRol.id)
            .map(r => r.permiso?.id);
          const permisosParaEliminar = relacionesExistentes.filter(relacion => 
            relacion.rol?.id === updatedRol.id && 
            !this.selectedPermisos.some(permiso => permiso.id === relacion.permiso?.id)
          );
  
          // Eliminar las relaciones que ya no están seleccionadas
          permisosParaEliminar.forEach((relacion) => {
            if (relacion.id !== undefined) {
              this.rolPermisoService.eliminarRolPermiso(relacion.id).subscribe();
            }
          });
          
          // Agregar las nuevas relaciones seleccionadas
          this.selectedPermisos.forEach((permiso) => {
            if (!idsRelacionadasExistentes.includes(permiso.id)) {
              const rolPermiso: RolPermiso = {
                rol: { id: updatedRol.id },
                permiso: { id: permiso.id }
              };
              this.rolPermisoService.crearRolPermiso(rolPermiso).subscribe();
            }
          });
  
          // Redirigir después de la actualización
          this.router.navigate(['/rol']);
        });
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/rol']);
  }
}