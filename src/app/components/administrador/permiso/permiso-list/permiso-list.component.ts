import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PermisoService } from '../../../../services/permiso/permiso.service';
import { Permiso } from '../../../../models/permiso/permiso.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../../../services/filter/filter.service';
import { PaginationService } from '../../../../services/pagination/pagination.service';

@Component({
  selector: 'app-permiso-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './permiso-list.component.html',
  styleUrl: './permiso-list.component.scss',
})
export class PermisoListComponent {
  permisos: Permiso[] = [];
  permisosFiltradas: Permiso[] = [];
  permisosPaginadas: Permiso[] = [];
  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 0;
  mostrarModal: boolean = false; // Control del modal
  permisoAEliminarId: number | null = null; // ID de permiso a eliminar

  constructor(
    private permisoService: PermisoService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerPermisos();
  }

  obtenerPermisos(): void {
    this.permisoService.obtenerPermisos().subscribe((data) => {
      this.permisos = data;
      this.permisosFiltradas = data;
      this.calcularPaginacion();
    });
  }

  eliminarPermiso(id: number): void {
    this.permisoService.eliminarPermiso(id).subscribe(() => {
      this.obtenerPermisos();
    });
  }

  irACrearPermiso(): void {
    this.router.navigate(['/permiso-create']);
  }

  irAEditarPermiso(id: number): void {
    this.router.navigate([`/permiso-update/${id}`]);
  }

  confirmarEliminarPermiso(id: number): void {
    this.permisoAEliminarId = id; // Guardamos el id de la Permiso a eliminar
    this.mostrarModal = true; // Mostramos el modal
  }

  eliminarPermisoConfirmada(): void {
    if (this.permisoAEliminarId !== null) {
      this.eliminarPermiso(this.permisoAEliminarId); // Realizamos la eliminación
      this.cerrarModal(); // Cerramos el modal
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false; // Ocultamos el modal
    this.permisoAEliminarId = null; // Limpiamos el id de la Permiso a eliminar
  }

  filtrarPermisos(): void {
    this.permisosFiltradas = this.filterService.filtrar(
      this.permisos,
      this.textoBusqueda
    );
    this.paginaActual = 1; // Resetear la página actual al buscar
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.permisosFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.permisosPaginadas = paginacion.paginatedData;
  }

  cambiarPagina(direccion: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion as 'previous' | 'next',
      this.totalPaginas
    );
    this.actualizarPermisosPaginadas();
  }

  actualizarPermisosPaginadas(): void {
    const paginacion = this.paginationService.paginate(
      this.permisosFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.permisosPaginadas = paginacion.paginatedData;
  }

  // Métodos para los botones
  crearNuevoPermiso() {
    console.log('Crear nuevo permiso');
    // Aquí puedes redirigir a una página de creación o abrir un modal para crear un nuevo permiso.
  }

  editarPermiso(id: number) {
    console.log('Editar permiso con ID:', id);
    // Aquí puedes redirigir a una página de edición o abrir un modal con los datos del permiso.
  }
}
