import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicioService } from '../../../services/servicio/servicio.service';
import { Servicio } from '../../../models/servicio/servicio.model';

@Component({
  selector: 'app-servicio-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './servicio-create.component.html',
  styleUrls: ['./servicio-create.component.scss']
})
export class ServicioCreateComponent {
  servicio: Servicio = {
    codigoServicio: '',
    nombre: '',
    descripcion: '',
    precioUnitario: 0,
    duracionEstimada: 0
  };

  constructor(
    private servicioService: ServicioService,
    private router: Router
  ) {}

  //crearServicio(): void {
   // this.servicioService.crearServicio(this.servicio).subscribe(() => {
     // this.router.navigate(['/servicio']);
    //});
  //}

  cancelar(): void {
    this.router.navigate(['/servicio']);
  }

  crearServicio(): void {
    this.servicioService.crearServicio(this.servicio).subscribe({
      next: () => {
        this.router.navigate(['/servicio'], {
          state: { mensaje: 'Servicio creado exitosamente.' }
        });
      },
      error: () => {
        this.router.navigate(['/servicio'], {
          state: { error: 'Ocurrió un error al crear el servicio.' }
        });
      }
    });
  }

}
