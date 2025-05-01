import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado/empleado.service';  // Cambiado a EmpleadoService
import { Empleado } from '../../models/empleado/empleado.model';  // Cambiado a Empleado
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export class EmpleadoComponent {
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  empleadosPaginados: Empleado[] = [];
  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  mostrarModal: boolean = false;
  empleadoAEliminarId: number | null = null;

  constructor(
    private empleadoService: EmpleadoService,  // Cambiado a EmpleadoService
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerEmpleados();
  }

  obtenerEmpleados(): void {
    this.empleadoService.obtenerEmpleados().subscribe((data) => {
      this.empleados = data;
      this.empleadosFiltrados = data;
      this.calcularPaginacion();
    });
  }

  eliminarEmpleado(id: number): void {
    this.empleadoService.eliminarEmpleado(id).subscribe(() => {
      this.obtenerEmpleados();
    });
  }

  irACrearEmpleado(): void {
    this.router.navigate(['/empleado-create']);
  }

  irAEditarEmpleado(id: number): void {
    this.router.navigate([`/empleado-update/${id}`]);
  }

  confirmarEliminarEmpleado(id: number): void {
    this.empleadoAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarEmpleadoConfirmado(): void {
    if (this.empleadoAEliminarId !== null) {
      this.eliminarEmpleado(this.empleadoAEliminarId);
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.empleadoAEliminarId = null;
  }

  filtrarEmpleados(): void {
    this.empleadosFiltrados = this.filterService.filtrar(
      this.empleados,
      this.textoBusqueda
    );
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.empleadosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.empleadosPaginados = paginacion.paginatedData;
  }

  cambiarPagina(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarEmpleadosPaginados();
  }

  actualizarEmpleadosPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.empleadosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.empleadosPaginados = paginacion.paginatedData;
  }
}
