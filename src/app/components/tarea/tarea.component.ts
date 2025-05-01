// src/app/components/tarea/tarea.component.ts

import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TareaService } from '../../services/tarea/tarea.service';
import { Tarea } from '../../models/tarea/tarea.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-tarea',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.scss'],
})
export class TareaComponent {
  tareas: Tarea[] = [];
  tareasFiltradas: Tarea[] = [];
  tareasPaginadas: Tarea[] = [];
  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  mostrarModal: boolean = false;
  tareaAEliminarId: number | null = null;

  constructor(
    private tareaService: TareaService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerTareas();
  }

  obtenerTareas(): void {
    this.tareaService.obtenerTareas().subscribe((data) => {
      this.tareas = data;
      this.tareasFiltradas = data;
      this.calcularPaginacion();
    });
  }

  eliminarTarea(id: number): void {
    this.tareaService.eliminarTarea(id).subscribe(() => {
      this.obtenerTareas();
    });
  }

  irACrearTarea(): void {
    this.router.navigate(['/tarea-create']);
  }

  irAEditarTarea(id: number): void {
    this.router.navigate([`/tarea-update/${id}`]);
  }

  confirmarEliminarTarea(id: number): void {
    this.tareaAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarTareaConfirmada(): void {
    if (this.tareaAEliminarId !== null) {
      this.eliminarTarea(this.tareaAEliminarId);
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.tareaAEliminarId = null;
  }

  filtrarTareas(): void {
    this.tareasFiltradas = this.filterService.filtrar(this.tareas, this.textoBusqueda);
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.tareasFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.tareasPaginadas = paginacion.paginatedData;
  }

  cambiarPagina(direccion: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion as 'previous' | 'next',
      this.totalPaginas
    );
    this.actualizarTareasPaginadas();
  }

  actualizarTareasPaginadas(): void {
    const paginacion = this.paginationService.paginate(
      this.tareasFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.tareasPaginadas = paginacion.paginatedData;
  }
}