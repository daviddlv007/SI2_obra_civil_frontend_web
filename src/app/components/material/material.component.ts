import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MaterialService } from '../../services/material/material.service';
import { Material } from '../../models/material/material.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent {
  materiales: Material[] = [];
  materialesFiltrados: Material[] = [];
  materialesPaginados: Material[] = [];
  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  mostrarModal: boolean = false;
  materialAEliminarId: number | null = null;

  constructor(
    private materialService: MaterialService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerMateriales();
  }

  obtenerMateriales(): void {
    this.materialService.obtenerMateriales().subscribe((data) => {
      this.materiales = data;
      this.materialesFiltrados = data;
      this.calcularPaginacion();
    });
  }

  eliminarMaterial(id: number): void {
    this.materialService.eliminarMaterial(id).subscribe(() => {
      this.obtenerMateriales();
    });
  }

  irACrearMaterial(): void {
    this.router.navigate(['/material-create']);
  }

  irAEditarMaterial(id: number): void {
    this.router.navigate([`/material-update/${id}`]);
  }

  confirmarEliminarMaterial(id: number): void {
    this.materialAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarMaterialConfirmado(): void {
    if (this.materialAEliminarId !== null) {
      this.eliminarMaterial(this.materialAEliminarId);
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.materialAEliminarId = null;
  }

  filtrarMateriales(): void {
    this.materialesFiltrados = this.filterService.filtrar(
      this.materiales,
      this.textoBusqueda
    );
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.materialesFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.materialesPaginados = paginacion.paginatedData;
  }

  cambiarPagina(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarMaterialesPaginados();
  }

  actualizarMaterialesPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.materialesFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.materialesPaginados = paginacion.paginatedData;
  }
}
