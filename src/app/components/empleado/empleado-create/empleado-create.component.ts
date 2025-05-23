import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmpleadoService } from '../../../services/empleado/empleado.service';
import { Empleado } from '../../../models/empleado/empleado.model';

@Component({
  selector: 'app-empleado-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './empleado-create.component.html',
  styleUrls: ['./empleado-create.component.scss']
})
export class EmpleadoCreateComponent {
  empleado: Empleado = {
    nombre: '',
    apellido: '',
    documentoIdentidad: '',
    tipoContrato: 'planta',
    fechaIngreso: '',
    salario: 0,
    activo: true,
    puesto: '',
    email: '',
    telefono: '',
    fechaTerminoContrato: ''
  };

  constructor(
    private empleadoService: EmpleadoService,
    private router: Router
  ) {}

  crearEmpleado(): void {
    this.empleadoService.crearEmpleado(this.empleado).subscribe({
      next: () => {
        this.router.navigate(['/empleado'], {
          state: { mensaje: 'Empleado creado exitosamente.' }  // Mensaje de éxito
        });
      },
      error: () => {
        this.router.navigate(['/empleado'], {
          state: { error: 'Ocurrió un error al crear el empleado.' }  // Mensaje de error
        });
      }
    });
  }


  cancelar(): void {
    this.router.navigate(['/empleado']);
  }
}
