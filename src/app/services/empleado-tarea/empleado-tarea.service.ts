import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmpleadoTarea } from '../../models/empleado-tarea/empleado-tarea.model';  // Asegúrate de tener el modelo correcto
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoTareaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener todas las relaciones entre empleado y tarea
  obtenerEmpleadoTareas(): Observable<EmpleadoTarea[]> {
    return this.http.get<EmpleadoTarea[]>(`${this.apiUrl}/empleado-tarea`);
  }

  // Obtener una relación entre empleado y tarea por su ID
  obtenerEmpleadoTareaPorId(id: number): Observable<EmpleadoTarea> {
    return this.http.get<EmpleadoTarea>(`${this.apiUrl}/empleado-tarea/${id}`);
  }

  // Crear una nueva relación entre empleado y tarea
  crearEmpleadoTarea(empleadoTarea: EmpleadoTarea): Observable<EmpleadoTarea> {
    return this.http.post<EmpleadoTarea>(`${this.apiUrl}/empleado-tarea`, empleadoTarea);
  }

  // Actualizar una relación existente entre empleado y tarea
  actualizarEmpleadoTarea(id: number, empleadoTarea: EmpleadoTarea): Observable<EmpleadoTarea> {
    return this.http.put<EmpleadoTarea>(`${this.apiUrl}/empleado-tarea/${id}`, empleadoTarea);
  }

  // Eliminar una relación entre empleado y tarea
  eliminarEmpleadoTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/empleado-tarea/${id}`);
  }
}
