// src/app/services/estimacion/estimacion.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstimacionRequest, EstimacionResponse } from '../../models/estimacion/estimacion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstimacionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  estimar(request: EstimacionRequest): Observable<EstimacionResponse> {
    return this.http.post<EstimacionResponse>(`${this.apiUrl}/estimaciones`, request);
  }
}
