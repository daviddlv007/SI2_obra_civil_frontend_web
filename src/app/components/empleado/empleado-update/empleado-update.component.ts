import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from '../../../services/empleado/empleado.service';
import { Empleado } from '../../../models/empleado/empleado.model';

@Component({
  selector: 'app-empleado-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './empleado-update.component.html',
  styleUrls: ['./empleado-update.component.scss']
})
export class EmpleadoUpdateComponent implements OnInit {
  empleado: Empleado = {
    id: 0,
    nombre: '',
    apellido: '',
    documentoIdentidad: '',
    tipoContrato: 'planta',
    fechaIngreso: '',
    salario: 0,
    activo: true
  };

  constructor(
    private empleadoService: EmpleadoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.empleadoService.obtenerEmpleadoPorId(id).subscribe((data) => {
        this.empleado = data;
      });
    }
  }


  actualizarEmpleado(): void {
    if (this.empleado.id != null) {  // Verificamos si el empleado tiene un ID
      this.empleadoService.actualizarEmpleado(this.empleado.id, this.empleado).subscribe({
        next: () => {
          this.router.navigate(['/empleado'], {
            state: { mensaje: 'Empleado actualizado exitosamente.' }  // Redirigimos con mensaje de éxito
          });
        },
        error: () => {
          this.router.navigate(['/empleado'], {
            state: { error: 'Ocurrió un error al actualizar el empleado.' }  // Redirigimos con mensaje de error
          });
        }
      });
    }
  }


  cancelar(): void {
    this.router.navigate(['/empleado']);
  }
}
