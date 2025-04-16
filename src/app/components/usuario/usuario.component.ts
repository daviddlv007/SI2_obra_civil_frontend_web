import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario/usuario.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuariosPaginados: Usuario[] = [];
  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  mostrarModal: boolean = false;
  usuarioAEliminarId: number | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe((data) => {
      this.usuarios = data;
      this.usuariosFiltrados = data;
      this.calcularPaginacion();
    });
  }

  eliminarUsuario(id: number): void {
    this.usuarioService.eliminarUsuario(id).subscribe(() => {
      this.obtenerUsuarios();
    });
  }

  irACrearUsuario(): void {
    this.router.navigate(['/usuario-create']);
  }

  irAEditarUsuario(id: number): void {
    this.router.navigate([`/usuario-update/${id}`]);
  }

  confirmarEliminarUsuario(id: number): void {
    this.usuarioAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarUsuarioConfirmado(): void {
    if (this.usuarioAEliminarId !== null) {
      this.eliminarUsuario(this.usuarioAEliminarId);
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioAEliminarId = null;
  }

  filtrarUsuarios(): void {
    this.usuariosFiltrados = this.filterService.filtrar(
      this.usuarios,
      this.textoBusqueda
    );
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.usuariosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.usuariosPaginados = paginacion.paginatedData;
  }

  cambiarPagina(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarUsuariosPaginados();
  }

  actualizarUsuariosPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.usuariosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.usuariosPaginados = paginacion.paginatedData;
  }
}