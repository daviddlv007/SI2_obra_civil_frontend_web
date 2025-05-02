import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../../models/empleado/empleado.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = `${environment.apiUrl}/empleados`;

  constructor(private http: HttpClient) {}

  // Obtener todos los empleados
  obtenerEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }

  // Obtener empleado por ID
  obtenerEmpleadoPorId(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo empleado
  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    const nuevoEmpleado = { ...empleado };
    delete nuevoEmpleado.id; // El ID lo genera el backend
    return this.http.post<Empleado>(this.apiUrl, nuevoEmpleado);
  }

  // Actualizar un empleado existente
  actualizarEmpleado(id: number, empleado: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}/${id}`, empleado);
  }

  // Eliminar un empleado
  eliminarEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


