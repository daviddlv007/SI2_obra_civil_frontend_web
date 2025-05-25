import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EquipoService } from '../../services/equipo/equipo.service';
import { Equipo } from '../../models/equipo/equipo.model';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.scss']
})
export class EquipoComponent {
  equipos: Equipo[] = [];
  equiposFiltrados: Equipo[] = [];
  equiposPaginados: Equipo[] = [];

  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;

  mostrarModal: boolean = false;
  equipoAEliminarId: number | null = null;

  constructor(
    private equipoService: EquipoService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerEquipos();
  }

  obtenerEquipos(): void {
    this.equipoService.obtenerEquipos().subscribe((data) => {
      this.equipos = data;
      this.equiposFiltrados = data;
      this.calcularPaginacion();
    });
  }

  eliminarEquipo(id: number): void {
    this.equipoService.eliminarEquipo(id).subscribe(() => {
      this.obtenerEquipos();
    });
  }

  irACrearEquipo(): void {
    this.router.navigate(['/equipo-create']);
  }

  irAEditarEquipo(id: number): void {
    this.router.navigate([`/equipo-update/${id}`]);
  }

  confirmarEliminarEquipo(id: number): void {
    this.equipoAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarEquipoConfirmado(): void {
    if (this.equipoAEliminarId !== null) {
      this.eliminarEquipo(this.equipoAEliminarId);
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.equipoAEliminarId = null;
  }

  filtrarEquipos(): void {
    this.equiposFiltrados = this.filterService.filtrar(
      this.equipos,
      this.textoBusqueda
    );
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.equiposFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.equiposPaginados = paginacion.paginatedData;
  }

  cambiarPagina(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarEquiposPaginados();
  }

  actualizarEquiposPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.equiposFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.equiposPaginados = paginacion.paginatedData;
  }
}
