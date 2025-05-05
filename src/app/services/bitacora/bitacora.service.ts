import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bitacora } from '../../models/bitacora/bitacora.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BitacoraService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerBitacoras(): Observable<Bitacora[]> {
    return this.http.get<Bitacora[]>(`${this.apiUrl}/bitacoras`);
  }

  obtenerBitacoraPorId(id: number): Observable<Bitacora> {
    return this.http.get<Bitacora>(`${this.apiUrl}/bitacoras/${id}`);
  }
}
