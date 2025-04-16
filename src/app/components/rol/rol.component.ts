import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RolService } from '../../services/rol/rol.service';
import { Rol } from '../../models/rol/rol.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss']
})
export class RolComponent {
  roles: Rol[] = [];
  rolesFiltrados: Rol[] = [];
  rolesPaginados: Rol[] = [];
  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  mostrarModal: boolean = false;
  rolAEliminarId: number | null = null;

  constructor(
    private rolService: RolService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerRoles();
  }

  obtenerRoles(): void {
    this.rolService.obtenerRoles().subscribe((data) => {
      this.roles = data;
      this.rolesFiltrados = data;
      this.calcularPaginacion();
    });
  }

  eliminarRol(id: number): void {
    this.rolService.eliminarRol(id).subscribe(() => {
      this.obtenerRoles();
    });
  }

  irACrearRol(): void {
    this.router.navigate(['/rol-create']);
  }

  irAEditarRol(id: number): void {
    this.router.navigate([`/rol-update/${id}`]);
  }

  confirmarEliminarRol(id: number): void {
    this.rolAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarRolConfirmado(): void {
    if (this.rolAEliminarId !== null) {
      this.eliminarRol(this.rolAEliminarId);
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.rolAEliminarId = null;
  }

  filtrarRoles(): void {
    this.rolesFiltrados = this.filterService.filtrar(this.roles, this.textoBusqueda);
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.rolesFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.rolesPaginados = paginacion.paginatedData;
  }

  cambiarPagina(direccion: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion as 'previous' | 'next',
      this.totalPaginas
    );
    this.actualizarRolesPaginados();
  }

  actualizarRolesPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.rolesFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.rolesPaginados = paginacion.paginatedData;
  }
}