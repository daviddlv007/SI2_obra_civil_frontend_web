import { Component } from '@angular/core';
import { BitacoraService } from '../../services/bitacora/bitacora.service';
import { Bitacora } from '../../models/bitacora/bitacora.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss'],
})
export class BitacoraComponent {
  bitacoras: Bitacora[] = [];
  bitacorasPaginadas: Bitacora[] = [];
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 0;

  constructor(private bitacoraService: BitacoraService, private router: Router) {}

  ngOnInit() {
    this.obtenerBitacoras();
  }

  obtenerBitacoras(): void {
    this.bitacoraService.obtenerBitacoras().subscribe((data) => {
      this.bitacoras = data;
      this.calcularPaginacion();
    });
  }

  calcularPaginacion(): void {
    const paginacion = this.paginate(
      this.bitacoras,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.bitacorasPaginadas = paginacion.paginatedData;
  }

  paginate(data: any[], page: number, itemsPerPage: number) {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return {
      totalPages: totalPages,
      paginatedData: data.slice(start, end),
    };
  }

  cambiarPagina(direccion: string): void {
    this.paginaActual = direccion === 'previous' ? this.paginaActual - 1 : this.paginaActual + 1;
    this.actualizarBitacorasPaginadas();
  }

  actualizarBitacorasPaginadas(): void {
    const paginacion = this.paginate(
      this.bitacoras,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.bitacorasPaginadas = paginacion.paginatedData;
  }

  generarAccion(bitacora: Bitacora): string {
    if (bitacora.tipoAccion === 'inicio de sesion') {
      return `Inicio de sesión por parte del usuario con id ${bitacora.usuarioId}`;
    }
    if (bitacora.tipoAccion === 'cierre de sesion') {
      return `Cierre de sesión por parte del usuario con id ${bitacora.usuarioId}`;
    }
    if (bitacora.tipoAccion === 'creacion') {
      return `Creación de la instancia con id ${bitacora.entidadId} de la entidad ${bitacora.entidad} por parte del usuario con id ${bitacora.usuarioId}`;
    }
    if (bitacora.tipoAccion === 'actualizacion') {
      return `Actualización de la instancia con id ${bitacora.entidadId} de la entidad ${bitacora.entidad} por parte del usuario con id ${bitacora.usuarioId}`;
    }
    if (bitacora.tipoAccion === 'eliminacion') {
      return `Eliminación de la instancia con id ${bitacora.entidadId} de la entidad ${bitacora.entidad} por parte del usuario con id ${bitacora.usuarioId}`;
    }
    return 'Acción desconocida';
  }
  
  
}
