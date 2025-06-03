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
import { ServicioTareaService } from '../../services/servicio-tarea/servicio-tarea.service';
import { ServicioTarea } from '../../models/servicio-tarea/servicio-tarea.model';
import { EmpleadoTarea } from '../../models/empleado-tarea/empleado-tarea.model';
import { EmpleadoTareaService } from '../../services/empleado-tarea/empleado-tarea.service';
import { EquipoTarea } from '../../models/equipo-tarea/equipo-tarea.mode';
import { EquipoTareaService } from '../../services/equipo-tarea/equipo-tarea.service';
import { MaterialTareaService } from '../../services/material-tarea/material-tarea.service';
import { MaterialTarea } from '../../models/material-tarea/material-tarea.model';

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
  serviciosTarea: ServicioTarea[] = [];
  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  mostrarModal: boolean = false;
  tareaAEliminarId: number | null = null;

    // Modal de ver servicios vinculados
  mostrarModalServicios: boolean = false;
  mostrarModalEmpleados: boolean = false;
  empleadosTarea: EmpleadoTarea[] = [];

  mostrarModalMateriales: boolean = false;
  materialesTarea: MaterialTarea[] = [];

  mostrarModalEquipos: boolean = false;
  equiposTarea: EquipoTarea[] = [];


  constructor(
    private tareaService: TareaService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService,
    private servicioTareaService: ServicioTareaService,
    private empleadoTareaService: EmpleadoTareaService,
    private materialTareaService: MaterialTareaService,
    private equipoTareaService: EquipoTareaService
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

  verServiciosPorTarea(idTarea: number): void {
    this.servicioTareaService.obtenerServicioTareas().subscribe((data) => {
      this.serviciosTarea = data.filter(st => st.tarea?.id === idTarea);
      console.log('Respuesta servicios:', this.serviciosTarea);
      this.mostrarModalServicios = true;
    });
  }

  cerrarModalServicios(): void {
    this.mostrarModalServicios = false;
    this.serviciosTarea = [];
  }

  verEmpleadosPorTarea(idTarea: number): void {
    this.empleadoTareaService.obtenerEmpleadoTareas().subscribe((data) => {
      this.empleadosTarea = data.filter(et => et.tarea?.id === idTarea);
      this.mostrarModalEmpleados = true;
    });
  }

  verEquiposPorTarea(idTarea: number): void {
    this.equipoTareaService.obtenerEquipoTareas().subscribe((data) => {
      this.equiposTarea = data.filter(eq => eq.tarea?.id === idTarea);
      this.mostrarModalEquipos = true;
    });
  }

  cerrarModalEquipos(): void {
    this.mostrarModalEquipos = false;
    this.equiposTarea = [];
  }

  cerrarModalEmpleados(): void {
    this.mostrarModalEmpleados = false;
    this.empleadosTarea = [];
}

verMaterialesPorTarea(idTarea: number): void {
  this.materialTareaService.obtenerMaterialTareas().subscribe((data) => {
    this.materialesTarea = data.filter(mt => mt.tarea?.id === idTarea);
    this.mostrarModalMateriales = true;
  });
}

cerrarModalMateriales(): void {
  this.mostrarModalMateriales = false;
  this.materialesTarea = [];
}

}
