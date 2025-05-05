import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../../models/material/material.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  obtenerMateriales(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/materiales`);
  }

  obtenerMaterialPorId(id: number): Observable<Material> {
    return this.http.get<Material>(`${this.apiUrl}/materiales/${id}`);
  }

  obtenerMaterialPorCodigo(codigo: string): Observable<Material> {
    return this.http.get<Material>(`${this.apiUrl}/materiales/codigo/${codigo}`);
  }

  crearMaterial(material: Material): Observable<Material> {
    const materialSinId = { ...material };
    delete materialSinId.id;
    return this.http.post<Material>(`${this.apiUrl}/materiales`, materialSinId);
  }

  actualizarMaterial(id: number, material: Material): Observable<Material> {
    return this.http.put<Material>(`${this.apiUrl}/materiales/${id}`, material);
  }

  eliminarMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/materiales/${id}`);
  }
}
