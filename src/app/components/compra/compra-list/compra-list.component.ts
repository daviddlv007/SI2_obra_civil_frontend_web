import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { CompraService } from '../../../services/compra/compra.service';
import { Compra } from '../../../models/compra/compra.model';
import { Router } from '@angular/router';
import { FilterService } from '../../../services/filter/filter.service';
import { PaginationService } from '../../../services/pagination/pagination.service';

@Component({
  selector: 'app-compra-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './compra-list.component.html',
  styleUrl: './compra-list.component.scss',
})
export class CompraListComponent {
  // compras
  compras: Compra[] = [];
  comprasFiltrados: Compra[] = [];
  comprasPaginados: Compra[] = [];

  textoBusqueda: string = '';
  //estadoSeleccionado: string = 'Todos'; // Nuevo
  paginaActual: number = 1;
  elementosPorPagina: number = 6;
  totalPaginas: number = 0;
  //mostrarModal: boolean = false;
  //proveedorAEliminarId: number | null = null;

  constructor(
    private compraService: CompraService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerCompras();
  }

  //COMPRAS
  obtenerCompras(): void {
    this.compraService.obtenerComprasDesc().subscribe((data) => {
      console.log('Compras', data);
      this.compras = data;
      this.filtrarcCompras();
    });
  }

  cambiarEstado(id: number, nuevoEstado: string): void {
    if (
      confirm(
        `¿Estás seguro de cambiar el estado a ${nuevoEstado.toLowerCase()}?`
      )
    ) {
      this.compraService.cambiarEstadoCompra(id, nuevoEstado).subscribe({
        next: () => {
          // Actualizar la lista de compras
          this.obtenerCompras();
        },
        error: (err) => {
          console.error('Error al cambiar el estado:', err);
        },
      });
      //console.log('Nuevo estado:', nuevoEstado);
    }
  }

  filtrarcCompras(): void {
    let resultado = [...this.compras];

    // Filtro por texto
    resultado = this.filterService.filtrar(resultado, this.textoBusqueda);

    this.comprasFiltrados = resultado;
    this.paginaActual = 1;
    this.calcularPaginacionCompras();
  }

  calcularPaginacionCompras(): void {
    const paginacion = this.paginationService.paginate(
      this.comprasFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.comprasPaginados = paginacion.paginatedData;
  }

  cambiarPaginaCompras(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarComprasPaginados();
  }

  actualizarComprasPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.comprasFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.comprasPaginados = paginacion.paginatedData;
  }

  /*irACrearCompra() {
    // Navegar a formulario de creación de compra
    console.log('Navegar a crear compra');
  }*/
  irACrearCompra(): void {
    this.router.navigate(['/compra-create']);
  }

  irACrearCompraMaterial(): void {
    this.router.navigate(['/compra-material-create']);
  }

  irACrearCompraEquipo(): void {
    this.router.navigate(['/compra-equipo-create']);
  }

  irACrearCompraServicio(): void {
    this.router.navigate(['/compra-servicio-create']);
  }

  irAVerDetalleCompra(id: number, tipo: string): void {
    console.log('Navegar a detalle compra');
    this.router.navigate([`/compra-detalle/${id}/${tipo}`]);
  }

  irAEditarCompra(id: number): void {
    console.log('Navegar a editar compra');
    this.router.navigate([`/compra-update/${id}`]);
  }

  confirmarEliminarCompra(id: number): void {
    //this.empleadoAEliminarId = id;
    //this.mostrarModal = true;
    console.log('Navegar a eliminar compra');
  }

  // Reportes
  irAReportes(): void {
    this.router.navigate(['/compra-reportes']);
  }
}
