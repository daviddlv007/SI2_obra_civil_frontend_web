import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from '../../../services/servicio/servicio.service'; // Importamos el servicio de Servicio
import { Servicio } from '../../../models/servicio/servicio.model'; // Importamos el modelo de Servicio

@Component({
  selector: 'app-servicio-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './servicio-update.component.html',
  styleUrls: ['./servicio-update.component.scss']
})
export class ServicioUpdateComponent implements OnInit {
  servicio: Servicio = {
    id: 0,
    codigoServicio: '', // Campo añadido para código del servicio
    nombre: '',
    descripcion: '',
    precioUnitario: 0,
    duracionEstimada: 0 // Campo añadido para duración estimada
  };

  constructor(
    private servicioService: ServicioService, // Servicio de Servicio
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID del servicio desde la URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      // Obtener el servicio por ID
      this.servicioService.obtenerServicioPorId(id).subscribe((data) => {
        this.servicio = data; // Asignamos los datos del servicio obtenido
      });
    }
  }

 // actualizarServicio(): void {
   // if (this.servicio.id) {
      // Si el servicio tiene un ID, lo actualizamos
     // this.servicioService.actualizarServicio(this.servicio.id, this.servicio).subscribe(() => {
       // this.router.navigate(['/servicio']); // Redirige a la lista de servicios
   //   });
   // }
  //}

  actualizarServicio(): void {
    if (this.servicio.id != null) {
      this.servicioService.actualizarServicio(this.servicio.id, this.servicio).subscribe({
        next: () => {
          this.router.navigate(['/servicio'], {
            state: { mensaje: 'Servicio actualizado exitosamente.' }
          });
        },
        error: () => {
          this.router.navigate(['/servicio'], {
            state: { error: 'Ocurrió un error al actualizar el servicio.' }
          });
        }
      });
    }
  }


  cancelar(): void {
    // Si se cancela, redirigimos a la lista de servicios
    this.router.navigate(['/servicio']);
  }
}
