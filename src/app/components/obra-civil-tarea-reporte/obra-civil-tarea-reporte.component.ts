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
      const fechaIni = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);
      const fechaFinTarea = new Date(t.fechaFin);
      const enRango = (!this.fechaInicio || fechaFinTarea >= fechaIni) &&
                      (!this.fechaFin || fechaFinTarea <= fechaFin);
      const coincideEstado = !this.estado || t.estado === this.estado;
      const coincidePrioridad = !this.prioridad || t.prioridad === this.prioridad;
      return enRango && coincideEstado && coincidePrioridad;
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
  
}
