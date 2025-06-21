import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaterialTarea } from '../../models/material-tarea/material-tarea.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaterialTareaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerMaterialTareas(): Observable<MaterialTarea[]> {
    return this.http.get<MaterialTarea[]>(`${this.apiUrl}/materiales-tareas`);
  }

  obtenerMaterialTareaPorId(id: number): Observable<MaterialTarea> {
    return this.http.get<MaterialTarea>(`${this.apiUrl}/materiales-tareas/${id}`);
  }

  crearMaterialTarea(materialTarea: MaterialTarea): Observable<MaterialTarea> {
    return this.http.post<MaterialTarea>(`${this.apiUrl}/materiales-tareas`, materialTarea);
  }

  actualizarMaterialTarea(id: number, materialTarea: MaterialTarea): Observable<MaterialTarea> {
    return this.http.put<MaterialTarea>(`${this.apiUrl}/materiales-tareas/${id}`, materialTarea);
  }

  eliminarMaterialTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/materiales-tareas/${id}`);
  }
}
