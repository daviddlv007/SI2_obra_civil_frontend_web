import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import { Proveedor } from '../../models/proveedor/proveedor.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss'],
})
export class ProveedorComponent {
  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = [];
  proveedoresPaginados: Proveedor[] = [];
  textoBusqueda: string = '';
  estadoSeleccionado: string = 'Todos'; // Nuevo
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  mostrarModal: boolean = false;
  proveedorAEliminarId: number | null = null;

  constructor(
    private proveedorService: ProveedorService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerProveedores();
  }

  obtenerProveedores(): void {
    this.proveedorService.obtenerProveedores().subscribe((data) => {
      console.log('Proveedores', data);
      this.proveedores = data;
      this.aplicarFiltros();
    });
  }

  eliminarProveedor(id: number): void {
    this.proveedorService.eliminarProveedor(id).subscribe(() => {
      this.obtenerProveedores();
    });
  }

  irACrearProveedor(): void {
    this.router.navigate(['/proveedor-create']);
  }

  irAEditarProveedor(id: number): void {
    this.router.navigate([`/proveedor-update/${id}`]);
  }

  confirmarEliminarProveedor(id: number): void {
    this.proveedorAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarProveedorConfirmado(): void {
    if (this.proveedorAEliminarId !== null) {
      this.eliminarProveedor(this.proveedorAEliminarId);
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.proveedorAEliminarId = null;
  }

  aplicarFiltros(): void {
    let resultado = [...this.proveedores];

    // Filtro por texto
    resultado = this.filterService.filtrar(resultado, this.textoBusqueda);

    // Filtro por estado
    if (this.estadoSeleccionado !== 'Todos') {
      resultado = resultado.filter((p) => p.estado === this.estadoSeleccionado);
    }

    this.proveedoresFiltrados = resultado;
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.proveedoresFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.proveedoresPaginados = paginacion.paginatedData;
  }

  cambiarPagina(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarProveedoresPaginados();
  }

  actualizarProveedoresPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.proveedoresFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.proveedoresPaginados = paginacion.paginatedData;
  }
}
