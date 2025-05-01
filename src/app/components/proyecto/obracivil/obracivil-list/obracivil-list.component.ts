import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ObracivilService } from '../../../../services/obracivil/obracivil.service';
import { Obracivil } from '../../../../models/obracivil/obracivil.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../../../services/filter/filter.service';
import { PaginationService } from '../../../../services/pagination/pagination.service';

@Component({
  selector: 'app-obracivil-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './obracivil-list.component.html',
  styleUrl: './obracivil-list.component.scss',
})
export class ObracivilListComponent {
  obras: Obracivil[] = [];
  obrasFiltradas: Obracivil[] = [];
  obrasPaginadas: Obracivil[] = [];
  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 0;

  mostrarModal: boolean = false; // Control del modal
  obraAEliminarId: number | null = null; // ID de permiso a eliminar

  mostrarModalImagen: boolean = false;
  imagenUrl: string | null = null;

  constructor(
    private obracivilService: ObracivilService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerObrasCiviles();
  }

  obtenerObrasCiviles(): void {
    this.obracivilService.obtenerObras().subscribe((data) => {
      this.obras = data;
      this.obrasFiltradas = data;
      console.log('OBRAS: ', this.obrasFiltradas);
      this.calcularPaginacion();
    });
  }

  eliminarObra(id: number): void {
    this.obracivilService.eliminarObra(id).subscribe(() => {
      this.obtenerObrasCiviles();
    });
  }

  irACrearObra(): void {
    this.router.navigate(['/obra-civil-create']);
  }

  irAEditarObra(id: number): void {
    this.router.navigate([`/obra-civil-update/${id}`]);
  }

  confirmarEliminarObra(id: number): void {
    this.obraAEliminarId = id; // Guardamos el id de la Obra a eliminar
    this.mostrarModal = true; // Mostramos el modal
  }

  eliminarObraConfirmada(): void {
    if (this.obraAEliminarId !== null) {
      this.eliminarObra(this.obraAEliminarId); // Realizamos la eliminación
      this.cerrarModal(); // Cerramos el modal
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false; // Ocultamos el modal
    this.obraAEliminarId = null; // Limpiamos el id de la Permiso a eliminar
  }

  filtrarObras(): void {
    this.obrasFiltradas = this.filterService.filtrar(
      this.obras,
      this.textoBusqueda
    );
    this.paginaActual = 1; // Resetear la página actual al buscar
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.obrasFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.obrasPaginadas = paginacion.paginatedData;
  }

  /*cambiarPagina(direccion: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion as 'previous' | 'next',
      this.totalPaginas
    );
    this.actualizarPermisosPaginadas();
  }*/
  cambiarPagina(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarUsuariosPaginados();
  }

  actualizarPermisosPaginadas(): void {
    const paginacion = this.paginationService.paginate(
      this.obrasFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.obrasPaginadas = paginacion.paginatedData;
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

  actualizarUsuariosPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.obrasFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.obrasPaginadas = paginacion.paginatedData;
  }

  // Método para abrir el modal con la imagen
  abrirModalImg(imagenUrl: string): void {
    this.imagenUrl = imagenUrl;
    this.mostrarModalImagen = true;
  }

  cerrarModalImg(): void {
    this.imagenUrl = null;
    this.mostrarModalImagen = false;
  }
}
