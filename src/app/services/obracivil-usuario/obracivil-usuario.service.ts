import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObracivilUsuario } from '../../models/obracivil-usuario/obracivil-usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ObracivilUsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerObraCivilUsuario(): Observable<ObracivilUsuario[]> {
    return this.http.get<ObracivilUsuario[]>(
      `${this.apiUrl}/obra-civil-usuario`
    );
  }

  obtenerObraCivilUsuarioPorId(id: number): Observable<ObracivilUsuario> {
    return this.http.get<ObracivilUsuario>(
      `${this.apiUrl}/obra-civil-usuario/${id}`
    );
  }

  crearObraCivilUsuario(
    obraCivilUsuario: ObracivilUsuario
  ): Observable<ObracivilUsuario> {
    return this.http.post<ObracivilUsuario>(
      `${this.apiUrl}/obra-civil-usuario`,
      obraCivilUsuario
    );
  }

  actualizarObraCivilUsuario(
    id: number,
    obraCivilUsuario: ObracivilUsuario
  ): Observable<ObracivilUsuario> {
    return this.http.put<ObracivilUsuario>(
      `${this.apiUrl}/obra-civil-usuario/${id}`,
      obraCivilUsuario
    );
  }

  eliminarObraCivilUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/obra-civil-usuario/${id}`);
  }

  obtenerRelacionesCli(obraCivilId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/obra-civil-usuario/${obraCivilId}/rol/Cliente`
    );
  }

  obtenerRelacionesEmp(obraCivilId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/obra-civil-usuario/${obraCivilId}/rol/Empleado`
    );
  }
}
