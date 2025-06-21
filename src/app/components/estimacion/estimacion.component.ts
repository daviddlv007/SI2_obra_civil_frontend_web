// src/app/components/estimacion/estimacion.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstimacionService } from '../../services/estimacion/estimacion.service';
import { EstimacionRequest, EstimacionResponse } from '../../models/estimacion/estimacion.model';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ParamConfig {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

@Component({
  selector: 'app-estimacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estimacion.component.html',
  styleUrls: ['./estimacion.component.scss']
})
export class EstimacionComponent implements OnInit {
  superficieM2!: number;
  parametros: { [key: string]: string } = {};
  respuesta?: EstimacionResponse;
  errorMsg?: string;
  cargando = false;

  parametrosConfig: ParamConfig[] = [
    {
      key: 'tipo_suelo',
      label: 'Tipo de Suelo',
      options: [
        { value: 'arenoso', label: 'Arenoso' },
        { value: 'rocoso', label: 'Rocoso' },
        { value: 'arcilloso', label: 'Arcilloso' }
      ]
    },
    {
      key: 'tipo_cimentacion',
      label: 'Tipo de Cimentación',
      options: [
        { value: 'radier', label: 'Radier' },
        { value: 'zapatas', label: 'Zapatas' },
        { value: 'pilotes', label: 'Pilotes' }
      ]
    },
    {
      key: 'tipo_estructura',
      label: 'Tipo de Estructura',
      options: [
        { value: 'hormigon', label: 'Hormigón' },
        { value: 'metalica', label: 'Metálica' },
        { value: 'mixta', label: 'Mixta' }
      ]
    },
    {
      key: 'calidad_acabado',
      label: 'Calidad de Acabado',
      options: [
        { value: 'basica', label: 'Básica' },
        { value: 'media', label: 'Media' },
        { value: 'alta', label: 'Alta' }
      ]
    },
    {
      key: 'acceso_obra',
      label: 'Acceso a la Obra',
      options: [
        { value: 'facil', label: 'Fácil' },
        { value: 'moderado', label: 'Moderado' },
        { value: 'dificil', label: 'Difícil' }
      ]
    },
    {
      key: 'zona',
      label: 'Zona / Ubicación',
      options: [
        { value: 'urbana', label: 'Urbana' },
        { value: 'periurbana', label: 'Periurbana' },
        { value: 'rural', label: 'Rural' }
      ]
    },
    {
      key: 'complejidad_diseno',
      label: 'Complejidad de Diseño',
      options: [
        { value: 'baja', label: 'Baja' },
        { value: 'media', label: 'Media' },
        { value: 'alta', label: 'Alta' }
      ]
    },
    {
      key: 'numero_pisos',
      label: 'Número de Pisos',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3-5', label: '3-5' },
        { value: '6+', label: '6 o más' }
      ]
    },
    {
      key: 'uso',
      label: 'Uso / Tipología',
      options: [
        { value: 'residencial', label: 'Residencial' },
        { value: 'comercial', label: 'Comercial' },
        { value: 'industrial', label: 'Industrial' }
      ]
    },
    {
      key: 'instalaciones',
      label: 'Instalaciones Interiores',
      options: [
        { value: 'basicas', label: 'Básicas' },
        { value: 'medias', label: 'Medias' },
        { value: 'completas', label: 'Completas' }
      ]
    },
    {
      key: 'estudio_geotecnico',
      label: 'Estudio Geotécnico',
      options: [
        { value: 'basico', label: 'Básico' },
        { value: 'avanzado', label: 'Avanzado' }
      ]
    },
    {
      key: 'diseno_sostenible',
      label: 'Diseño Sostenible / Certificaciones',
      options: [
        { value: 'no', label: 'No' },
        { value: 'si', label: 'Sí' }
      ]
    },
    {
      key: 'honorarios_profesionales',
      label: 'Honorarios Profesionales',
      options: [
        { value: 'base', label: 'Base' }
      ]
    },
    {
      key: 'permisos',
      label: 'Permisos y Licencias',
      options: [
        { value: 'no', label: 'No' },
        { value: 'si', label: 'Sí' }
      ]
    }
  ];

  constructor(private estimacionService: EstimacionService) {}

  ngOnInit() {
    this.superficieM2 = 0;
    this.parametrosConfig.forEach(pc => {
      if (pc.options.length > 0) {
        this.parametros[pc.key] = pc.options[0].value;
      }
    });
  }

  submitEstimacion() {
    this.errorMsg = undefined;
    this.respuesta = undefined;
    if (!this.superficieM2 || this.superficieM2 <= 0) {
      this.errorMsg = 'Ingrese una superficie válida (> 0).';
      return;
    }
    const req: EstimacionRequest = {
      superficieM2: this.superficieM2,
      parametros: { ...this.parametros }
    };
    this.cargando = true;
    this.estimacionService.estimar(req).subscribe({
      next: resp => {
        this.respuesta = resp;
        this.cargando = false;
      },
      error: err => {
        console.error('Error en estimación:', err);
        this.errorMsg = 'Error al calcular la estimación.';
        this.cargando = false;
      }
    });
  }

  exportarExcel(): void {
    if (!this.respuesta) return;
    const filas: any[] = [];
    Object.entries(this.respuesta.detalle).forEach(([key, value]) => {
      filas.push({ Concepto: key, Valor: value });
    });
    filas.push({ Concepto: 'Costo por m² [USD]', Valor: this.respuesta.costoPorM2 });
    filas.push({ Concepto: 'Costo total [USD]', Valor: this.respuesta.costoTotal });

    const worksheet = XLSX.utils.json_to_sheet(filas);
    const workbook = { Sheets: { 'Estimación': worksheet }, SheetNames: ['Estimación'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `estimacion_${new Date().getTime()}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  exportarPDF(): void {
    if (!this.respuesta) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Resultado de Estimación de Costos', 14, 15);

    const filas: (string | number)[][] = [];
    Object.entries(this.respuesta.detalle).forEach(([key, value]) => {
      filas.push([key, value]);
    });
    filas.push(['Costo por m² [USD]', this.respuesta.costoPorM2]);
    filas.push(['Costo total [USD]', this.respuesta.costoTotal]);

    autoTable(doc, {
      startY: 25,
      head: [['Concepto', 'Valor']],
      body: filas,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 25 },
      theme: 'striped'
    });

    const fileName = `estimacion_${new Date().getTime()}.pdf`;
    doc.save(fileName);
  }
}
