export interface Equipo {

    id?: number;                    // autogenerado
    codigoActivo?: string;          // único
    nombre?: string;
    descripcion?: string;
    unidadMedida?: string;
    tipoEquipo?: string;
    precioUnitario?: number;        // mapeado desde BigDecimal
    fechaAdquisicion?: string;      // usar formato 'YYYY-MM-DD'
  }
