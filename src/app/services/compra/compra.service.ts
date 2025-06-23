import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../../models/compra/compra.model';
import { Page } from '../../models/page/page.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/compras`);
  }

  obtenerComprasDesc(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/compras/ordenadas`);
  }

  obtenerCompraPorId(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/compras/${id}`);
  }

  crearCompra(compra: Compra): Observable<Compra> {
    const compraSinId = { ...compra };
    delete compraSinId.id;

    return this.http.post<Compra>(`${this.apiUrl}/compras`, compraSinId);
  }

  actualizarCompra(id: number, compra: Compra): Observable<Compra> {
    return this.http.put<Compra>(`${this.apiUrl}/compras/${id}`, compra);
  }

  cambiarEstadoCompra(id: number, nuevoEstado: string): Observable<Compra> {
    // Asumiendo que tu API espera un PATCH para actualizar parcialmente
    return this.http.patch<Compra>(`${this.apiUrl}/compras/${id}/estado`, {
      estado: nuevoEstado,
    });

    // O si tu API espera un PUT:
    // return this.http.put<Compra>(`${this.apiUrl}/compras/${id}/estado`, {
    //   estado: nuevoEstado
    // });
  }

  eliminarCompra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/compras/${id}`);
  }

  /*getComprasConFiltros(filtros: any): Observable<Compra[]> {
    let params = new HttpParams();

    if (filtros.fechaInicio) {
      params = params.append('fechaInicio', filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      params = params.append('fechaFin', filtros.fechaFin);
    }

    if (filtros.tipo) {
      params = params.append('tipoProveedor', filtros.tipo);
    }

    // Agregar estado si lo necesitas
    if (filtros.estado) {
      params = params.append('estadoCompra', filtros.estado);
    }

    return this.http.get<Compra[]>(`${this.apiUrl}/compras/filtradas`, {
      params,
    });
  }*/

  getComprasConFiltros(filtros: any): Observable<Page<Compra>> {
    let params = new HttpParams();

    if (filtros.fechaInicio) {
      params = params.append('fechaInicio', filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      params = params.append('fechaFin', filtros.fechaFin);
    }

    if (filtros.tipo) {
      params = params.append('tipoProveedor', filtros.tipo);
    }

    if (filtros.estado) {
      params = params.append('estadoCompra', filtros.estado);
    }

    // Añade parámetros de paginación si es necesario
    params = params.append('page', '0');
    params = params.append('size', '1000'); // Un número grande para obtener todos los resultados

    return this.http.get<Page<Compra>>(`${this.apiUrl}/compras/filtradas`, {
      params,
    });
  }
}
