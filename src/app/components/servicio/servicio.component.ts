import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../../services/servicio/servicio.service';
import { Servicio } from '../../models/servicio/servicio.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-servicio',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss']
})
export class ServicioComponent implements OnInit {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];
  serviciosPaginados: Servicio[] = [];
  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  mostrarModal: boolean = false;
  servicioAEliminarId: number | null = null;

  constructor(
    private servicioService: ServicioService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.obtenerServicios();
  }

  // Obtener los servicios desde el servicio
  obtenerServicios(): void {
    this.servicioService.obtenerServicios().subscribe((data) => {
      this.servicios = data;
      this.serviciosFiltrados = data;
      this.calcularPaginacion();
    });
  }

  // Eliminar un servicio específico
  eliminarServicio(id: number): void {
    this.servicioService.eliminarServicio(id).subscribe(() => {
      this.obtenerServicios();
    });
  }

  // Redirige a la página de creación de servicio
  irACrearServicio(): void {
    this.router.navigate(['/servicio-create']);
  }

  // Redirige a la página de edición de servicio
  irAEditarServicio(id: number): void {
    this.router.navigate([`/servicio-update/${id}`]);
  }

  // Muestra el modal de confirmación de eliminación
  confirmarEliminarServicio(id: number): void {
    this.servicioAEliminarId = id;
    this.mostrarModal = true;
  }

  // Elimina el servicio confirmado
  eliminarServicioConfirmado(): void {
    if (this.servicioAEliminarId !== null) {
      this.eliminarServicio(this.servicioAEliminarId);
      this.cerrarModal();
    }
  }

  // Cierra el modal
  cerrarModal(): void {
    this.mostrarModal = false;
    this.servicioAEliminarId = null;
  }

  // Filtra los servicios según el texto de búsqueda
  filtrarServicios(): void {
    this.serviciosFiltrados = this.filterService.filtrar(
      this.servicios,
      this.textoBusqueda
    );
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  // Calcula la paginación de los servicios filtrados
  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.serviciosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.serviciosPaginados = paginacion.paginatedData;
  }

  // Cambia la página hacia la anterior o siguiente
  cambiarPagina(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarServiciosPaginados();
  }

  // Actualiza los servicios paginados al cambiar de página
  actualizarServiciosPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.serviciosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.serviciosPaginados = paginacion.paginatedData;
  }
}
