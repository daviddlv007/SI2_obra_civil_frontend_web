import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AutoService } from '../../services/auto/auto.service';
import { Auto } from '../../models/auto/auto.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-auto',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.scss'],
})
export class AutoComponent {
  autos: Auto[] = [];
  autosFiltrados: Auto[] = [];
  autosPaginados: Auto[] = [];
  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  mostrarModal: boolean = false;
  autoAEliminarId: number | null = null;

  constructor(
    private autoService: AutoService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}
//1
  ngOnInit() {
    this.obtenerAutos();
  }
//2
  obtenerAutos(): void {
    this.autoService.obtenerAutos().subscribe((data) => {
      this.autos = data;
      this.autosFiltrados = data;
      this.calcularPaginacion();
    });
  }
//3
  eliminarAuto(id: number): void {
    this.autoService.eliminarAuto(id).subscribe(() => {
      this.obtenerAutos();
    });
  }
//4
  irACrearAuto(): void {
    this.router.navigate(['/auto-create']);
  }
//5
  irAEditarAuto(id: number): void {
    this.router.navigate([`/auto-update/${id}`]);
  }
//6
  confirmarEliminarAuto(id: number): void {
    this.autoAEliminarId = id;
    this.mostrarModal = true;
  }
//7
  eliminarAutoConfirmado(): void {
    if (this.autoAEliminarId !== null) {
      this.eliminarAuto(this.autoAEliminarId);
      this.cerrarModal();
    }
  }
//8
  cerrarModal(): void {
    this.mostrarModal = false;
    this.autoAEliminarId = null;
  }
//9
  filtrarAutos(): void {
    this.autosFiltrados = this.filterService.filtrar(this.autos, this.textoBusqueda);
    this.paginaActual = 1;
    this.calcularPaginacion();
  }
//10
  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.autosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.autosPaginados = paginacion.paginatedData;
  }
//11
  cambiarPagina(direccion: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion as 'previous' | 'next',
      this.totalPaginas
    );
    this.actualizarAutosPaginados();
  }
//12
  actualizarAutosPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.autosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.autosPaginados = paginacion.paginatedData;
  }
}
