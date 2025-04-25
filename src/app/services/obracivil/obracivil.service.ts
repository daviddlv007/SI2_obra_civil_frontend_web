import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Obracivil } from '../../models/obracivil/obracivil.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ObracivilService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerObras(): Observable<Obracivil[]> {
    return this.http.get<Obracivil[]>(`${this.apiUrl}/obras`);
  }

  obtenerObrasPorId(id: number): Observable<Obracivil> {
    return this.http.get<Obracivil>(`${this.apiUrl}/obras/${id}`);
  }

  crearObra(Obra: Obracivil): Observable<Obracivil> {
    const obraSinId = { ...Obra };
    //delete obraSinId.id;

    return this.http.post<Obracivil>(`${this.apiUrl}/obras`, obraSinId);
  }

  actualizarObra(id: number, obra: Obracivil): Observable<Obracivil> {
    return this.http.put<Obracivil>(`${this.apiUrl}/obras/${id}`, obra);
  }

  eliminarObra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/obras/${id}`);
  }
}
