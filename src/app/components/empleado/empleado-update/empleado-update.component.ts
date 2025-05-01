import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from '../../../services/empleado/empleado.service'; // Importamos el servicio de Empleado
import { Empleado } from '../../../models/empleado/empleado.model'; // Importamos el modelo de Empleado

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
    puesto: '',
    salario: 0
  };

  constructor(
    private empleadoService: EmpleadoService, // Servicio de Empleado
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID del empleado desde la URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      // Obtener el empleado por ID
      this.empleadoService.obtenerEmpleadoPorId(id).subscribe((data) => {
        this.empleado = data; // Asignamos los datos del empleado obtenido
      });
    }
  }

  actualizarEmpleado(): void {
    if (this.empleado.id) {
      // Si el empleado tiene un ID, lo actualizamos
      this.empleadoService.actualizarEmpleado(this.empleado.id, this.empleado).subscribe(() => {
        this.router.navigate(['/empleado']); // Redirige a la lista de empleados
      });
    }
  }

  cancelar(): void {
    // Si se cancela, redirigimos a la lista de empleados
    this.router.navigate(['/empleado']);
  }
}
