import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ObracivilService } from '../../../../services/obracivil/obracivil.service';
import { Obracivil } from '../../../../models/obracivil/obracivil.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../../../services/filter/filter.service';
import { PaginationService } from '../../../../services/pagination/pagination.service';

import * as L from 'leaflet';

@Component({
  selector: 'app-obracivil-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './obracivil-list.component.html',
  styleUrl: './obracivil-list.component.scss',
})
export class ObracivilListComponent implements AfterViewInit {
  obras: Obracivil[] = [];
  obrasFiltradas: Obracivil[] = [];
  obrasPaginadas: Obracivil[] = [];
  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 0;

  mostrarModal: boolean = false; // Control del modal
  obraAEliminarId: number | null = null; // ID de permiso a eliminar

  mostrarModalImagen: boolean = false;
  imagenUrl: string | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private obracivilService: ObracivilService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerObrasCivilesDesc();
  }

  ngAfterViewInit(): void {
    // Crear el mapa de Leaflet después de que la vista esté completamente cargada
    //this.initMaps();
    // Esperamos un poco para que los elementos del DOM se rendericen completamente
    this.cdr.detectChanges();
    setTimeout(() => {
      this.initMaps();
    }, 500); // Pequeño retraso de 100ms
  }

  initMaps(): void {
    if (this.obrasPaginadas.length > 0) {
      this.obrasPaginadas.forEach((obra, index) => {
        const mapId = `map-${index}`; // Generamos un id único para cada mapa
        const mapElement = document.getElementById(mapId);

        if (mapElement) {
          // Verifica si el div con el ID existe
          const map = L.map(mapId).setView([obra.latitud!, obra.longitud!], 13);

          // Agregar capa de mapa (usamos OpenStreetMap)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          // Crear un icono sin sombra
          const customIcon = L.icon({
            iconUrl:
              'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Icono predeterminado de Leaflet
            shadowUrl: '', // No usamos sombra
            iconSize: [25, 41], // Tamaño del icono
            iconAnchor: [12, 41], // Punto de anclaje en el icono
            popupAnchor: [0, -41], // Anclaje para los popups
          });

          // Agregar marcador con icono personalizado sin sombra
          L.marker([obra.latitud!, obra.longitud!], { icon: customIcon })
            .addTo(map)
            .bindPopup(`Ubicación de la obra: ${obra.nombre}`)
            .openPopup();
        } else {
          console.error(
            `El contenedor para el mapa con id ${mapId} no se encuentra.`
          );
        }
      });
    } else {
      // Si no hay obras, centra el mapa en Santa Cruz
      /*const map = L.map('map').setView([-17.769553, -63.171463], 5); // Centrado en Santa Cruz

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);*/
    }
  }

  obtenerObrasCiviles(): void {
    this.obracivilService.obtenerObras().subscribe((data) => {
      this.obras = data;
      this.obrasFiltradas = data;
      console.log('OBRAS: ', this.obrasFiltradas);
      this.calcularPaginacion();
    });
  }

  obtenerObrasCivilesDesc(): void {
    this.obracivilService.obtenerObrasDesc().subscribe((data) => {
      this.obras = data;
      this.obrasFiltradas = data;
      console.log('OBRAS: ', this.obrasFiltradas);
      this.calcularPaginacion();
    });
  }

  irACrearObra(): void {
    this.router.navigate(['/obra-civil-create']);
  }

  irAEditarObra(id: number): void {
    this.router.navigate([`/obra-civil-update/${id}`]);
  }

  verDetalleObra(id: number): void {
    this.router.navigate([`/obra-civil-show/${id}`]);
  }

  eliminarObra(id: number): void {
    this.obracivilService.eliminarObra(id).subscribe(() => {
      this.obtenerObrasCivilesDesc();
    });
  }

  confirmarEliminarObra(id: number): void {
    //console.log('id', id);
    this.obraAEliminarId = id; // Guardamos el id de la Obra a eliminar
    //console.log('obraAEliminarId', this.obraAEliminarId);
    this.mostrarModal = true; // Mostramos el modal
  }

  eliminarObraConfirmada(): void {
    console.log('obraAEliminarId', this.obraAEliminarId);
    if (this.obraAEliminarId !== null) {
      //this.eliminarObra(this.obraAEliminarId); // Realizamos la eliminación
      console.log('Obra Civil en proceso.');
      this.cerrarModal(); // Cerramos el modal
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false; // Ocultamos el modal
    this.obraAEliminarId = null; // Limpiamos el id de la Permiso a eliminar
  }

  filtrarObras(): void {
    this.obrasFiltradas = this.filterService.filtrar(
      this.obras,
      this.textoBusqueda
    );
    this.paginaActual = 1; // Resetear la página actual al buscar
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.obrasFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.obrasPaginadas = paginacion.paginatedData;
  }

  cambiarPagina(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarUsuariosPaginados();
  }

  actualizarPermisosPaginadas(): void {
    const paginacion = this.paginationService.paginate(
      this.obrasFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.obrasPaginadas = paginacion.paginatedData;
  }

  // Métodos para los botones
  crearNuevoPermiso() {
    console.log('Crear nuevo permiso');
    // Aquí puedes redirigir a una página de creación o abrir un modal para crear un nuevo permiso.
  }

  editarPermiso(id: number) {
    console.log('Editar permiso con ID:', id);
    // Aquí puedes redirigir a una página de edición o abrir un modal con los datos del permiso.
  }

  actualizarUsuariosPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.obrasFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.obrasPaginadas = paginacion.paginatedData;
  }

  // Método para abrir el modal con la imagen
  abrirModalImg(imagenUrl: string): void {
    this.imagenUrl = imagenUrl;
    this.mostrarModalImagen = true;
  }

  cerrarModalImg(): void {
    this.imagenUrl = null;
    this.mostrarModalImagen = false;
  }

  verAvanceObra(id: number): void {
    this.router.navigate([`/obra-civil-gantt/${id}`]);
  }
  
  generarReporteObra(id: number): void {
    this.router.navigate([`/obra-civil-tarea-reporte/${id}`]);
  }
  

}
