import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PermisoService } from '../../../../services/permiso/permiso.service';
import { Permiso } from '../../../../models/permiso/permiso.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-permiso-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './permiso-update.component.html',
  styleUrl: './permiso-update.component.scss',
})
export class PermisoUpdateComponent implements OnInit {
  permiso: Permiso = { id: 0, nombre: '', descripcion: '' };

  submitted = false;

  constructor(
    private permisoService: PermisoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.permisoService.obtenerPermisoPorId(id).subscribe((data) => {
        this.permiso = data;
      });
    }
  }

  actualizarPermiso(): void {
    if (this.permiso.id) {
      this.permisoService
        .actualizarPermiso(this.permiso.id, this.permiso)
        .subscribe(() => {
          this.router.navigate(['/permiso']); // Redirige tras la actualización
        });
    }
  }

  cancelar(): void {
    this.router.navigate(['/permiso']);
  }
}
