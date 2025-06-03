import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../../models/compra/compra.model';
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

  eliminarCompra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/compras/${id}`);
  }
}
