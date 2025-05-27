import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TareaService } from '../../services/tarea/tarea.service';
import { Tarea } from '../../models/tarea/tarea.model';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-obra-civil-tarea-reporte',
    standalone: true,   // <-- importante para componente standalone
    imports: [FormsModule, CommonModule],  // <-- importa FormsModule aquí
    templateUrl: './obra-civil-tarea-reporte.component.html',
    styleUrls: ['./obra-civil-tarea-reporte.component.scss']
  })
export class ObraCivilTareaReporteComponent implements OnInit {
  tareas: Tarea[] = [];
  tareasFiltradas: Tarea[] = [];
  idObra!: number;

  fechaInicio: string = '';
  fechaFin: string = '';
  estado: string = '';
  prioridad: string = '';

  estados = ['pendiente', 'en progreso', 'completada', 'cancelada'];
  prioridades = ['baja', 'media', 'alta'];

  nombreObra: string = '';

  constructor(
    private route: ActivatedRoute,
    private tareaService: TareaService
  ) {}

  ngOnInit(): void {
    this.idObra = +this.route.snapshot.paramMap.get('id_obra')!;
    this.tareaService.obtenerTareas().subscribe(tareas => {
      this.tareas = tareas.filter(t => t.obraCivil.id === this.idObra);
      this.nombreObra = this.tareas[0]?.obraCivil?.nombre || 'Obra Civil';
      this.filtrar();
    });
  }

filtrar(): void {
  this.tareasFiltradas = this.tareas.filter(t => {
    const fechaIni = this.fechaInicio ? new Date(this.fechaInicio) : null;
    const fechaFin = this.fechaFin ? new Date(this.fechaFin) : null;
    const fechaInicioTarea = new Date(t.fechaInicio);
    const fechaFinTarea = new Date(t.fechaFin);

    const enRangoInicio = !fechaIni || fechaInicioTarea >= fechaIni;
    const enRangoFin = !fechaFin || fechaFinTarea <= fechaFin;
    
    const coincideEstado = !this.estado || t.estado === this.estado;
    const coincidePrioridad = !this.prioridad || t.prioridad === this.prioridad;
    
    return enRangoInicio && enRangoFin && coincideEstado && coincidePrioridad;
  });
}
  

  exportarExcel(): void {
    const data = this.tareasFiltradas.map(({ id, obraCivil, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'Reporte': worksheet }, SheetNames: ['Reporte'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `${this.nombreObra}-reporte.xlsx`);
  }

  exportarPDF(): void {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text(`Reporte de Tareas de la Obra ${this.nombreObra}`, 14, 15);
  
    const filas = this.tareasFiltradas.map(t => ([
      t.nombre,
      t.descripcion,
      t.fechaInicio,
      t.fechaFin,
      t.estado,
      t.prioridad
    ]));
  
    autoTable(doc, {
      startY: 25,
      head: [[
        'Nombre',
        'Descripcion',
        'Fecha Inicio',
        'Fecha Fin',
        'Estado',
        'Prioridad'
      ]],
      body: filas,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [41, 128, 185], // azul elegante
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 25 },
      theme: 'striped'
    });
  
    doc.save(`${this.nombreObra}-reporte.pdf`);
  }

exportarHTML(): void {
  // Crear contenido HTML
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reporte ${this.nombreObra}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #2980b9; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f5f5f5; }
        .fecha { white-space: nowrap; }
      </style>
    </head>
    <body>
      <h1>Reporte de Tareas - ${this.nombreObra}</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Prioridad</th>
          </tr>
        </thead>
        <tbody>
          ${this.tareasFiltradas.map(tarea => `
            <tr>
              <td>${tarea.nombre}</td>
              <td>${tarea.descripcion}</td>
              <td class="fecha">${this.formatDate(tarea.fechaInicio)}</td>
              <td class="fecha">${this.formatDate(tarea.fechaFin)}</td>
              <td>${tarea.estado}</td>
              <td>${tarea.prioridad}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Crear y descargar archivo
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  FileSaver.saveAs(blob, `${this.nombreObra}-reporte.html`);
}

private formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

  
}
