// src/app/models/estimacion.model.ts

export interface EstimacionRequest {
  superficieM2: number;
  parametros: { [key: string]: string };
}

export interface EstimacionResponse {
  costoPorM2: number;
  costoTotal: number;
  detalle: { [key: string]: number };
}
