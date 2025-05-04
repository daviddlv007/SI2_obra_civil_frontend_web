import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../../services/servicio/servicio.service';
import { Servicio } from '../../models/servicio/servicio.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';
import { Location } from '@angular/common';



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
    private paginationService: PaginationService,
    private location: Location
  ) {}

  mensajeExito: string = '';
  mensajeError: string = '';

  ngOnInit(): void {
    const state = this.location.getState() as { mensaje?: string, error?: string };

    if (state?.mensaje) {
      this.mensajeExito = state.mensaje;
      setTimeout(() => this.mensajeExito = '', 3000);
    }

    if (state?.error) {
      this.mensajeError = state.error;
      setTimeout(() => this.mensajeError = '', 3000);
    }

    this.obtenerServicios();
  }

  obtenerServicios(): void {
    this.servicioService.obtenerServicios().subscribe((data) => {
      this.servicios = data;
      this.serviciosFiltrados = data;
      this.calcularPaginacion();
    });
  }

  eliminarServicio(id: number): void {
    this.servicioService.eliminarServicio(id).subscribe(() => {
      this.obtenerServicios();
      alert('Servicio eliminado exitosamente.');
    });
  }

  irACrearServicio(): void {
    this.router.navigate(['/servicio-create']);
  }

  irAEditarServicio(id: number): void {
    this.router.navigate([`/servicio-update/${id}`]);
  }

  confirmarEliminarServicio(id: number): void {
    this.servicioAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarServicioConfirmado(): void {
    if (this.servicioAEliminarId !== null) {
      this.eliminarServicio(this.servicioAEliminarId);
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.servicioAEliminarId = null;
  }

  filtrarServicios(): void {
    this.serviciosFiltrados = this.filterService.filtrar(
      this.servicios,
      this.textoBusqueda
    );
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.serviciosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.serviciosPaginados = paginacion.paginatedData;
  }

  cambiarPagina(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarServiciosPaginados();
  }

  actualizarServiciosPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.serviciosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.serviciosPaginados = paginacion.paginatedData;
  }


}
