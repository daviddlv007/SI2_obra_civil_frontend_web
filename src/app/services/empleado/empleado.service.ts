import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../../models/empleado/empleado.model';  // Cambiar a Empleado
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}/empleados`);
  }

  obtenerEmpleadoPorId(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/empleados/${id}`);
  }

  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    const empleadoSinId = { ...empleado };
    delete empleadoSinId.id;
    return this.http.post<Empleado>(`${this.apiUrl}/empleados`, empleadoSinId);
  }

  actualizarEmpleado(id: number, empleado: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}/empleados/${id}`, empleado);
  }

  eliminarEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/empleados/${id}`);
  }
}

