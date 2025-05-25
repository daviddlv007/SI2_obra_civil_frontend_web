import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleChartsModule } from 'angular-google-charts';
import { TareaService } from '../../services/tarea/tarea.service';
import { Tarea } from '../../models/tarea/tarea.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-obra-civil-gantt',
  standalone: true,
  imports: [CommonModule, GoogleChartsModule, FormsModule],
  templateUrl: './obra-civil-gantt.component.html',
  styleUrls: ['./obra-civil-gantt.component.scss']
})
export class ObraCivilGanttComponent implements OnInit {
  chart: any;
  chartData: any[] = [];
  rowColors: string[] = [];

  // Filtro por estado
  estados: string[] = [];
  estadoFilter = 'Todos';

  chartColumns = [
    { type: 'string', label: 'Tarea' },
    { type: 'date',   label: 'Fecha Inicio' },
    { type: 'date',   label: 'Fecha Fin' },
    { type: 'string', role: 'tooltip', p: { html: true } }
  ];

  chartOptions: any = {
    height: 400,
    timeline: { showRowLabels: true },
    tooltip: { isHtml: true },
    colors: []
  };

  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private tareaService: TareaService
  ) {}

  ngOnInit(): void {
    const obraId = Number(this.route.snapshot.paramMap.get('id'));
    if (!obraId) return;

    this.isLoading = true;
    this.tareaService.obtenerTareas().subscribe({
      next: (tareas: Tarea[]) => {
        // 1. Filtrar por obra
        let tareasObra = tareas.filter(t => t.obraCivil.id === obraId);

        // 2. Extraer estados únicos y añadir "Todos"
        const setEstados = new Set<string>(tareasObra.map(t => t.estado));
        this.estados = ['Todos', ...Array.from(setEstados)];

        // 3. Aplicar filtro inicial
        this.applyFilterAndRender(tareasObra);

        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las tareas. Intenta recargar.';
        this.isLoading = false;
      }
    });
  }

  onEstadoChange(): void {
    // recarga el gráfico al cambiar el filtro
    this.isLoading = true;
    this.tareaService.obtenerTareas().subscribe({
      next: (tareas: Tarea[]) => {
        const obraId = Number(this.route.snapshot.paramMap.get('id'));
        let tareasObra = tareas.filter(t => t.obraCivil.id === obraId);
        this.applyFilterAndRender(tareasObra);
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Error al filtrar. Intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }
  private applyFilterAndRender(tareasObra: Tarea[]): void {
    if (this.estadoFilter !== 'Todos') {
      tareasObra = tareasObra.filter(t => t.estado === this.estadoFilter);
    }
  
    tareasObra.sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());
  
    this.chartData = [];
    this.rowColors = [];
  
    tareasObra.forEach(t => {
      const start = new Date(t.fechaInicio);
      const end = new Date(t.fechaFin);
      const durDias = Math.max(
        1,
        Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      );
  
      let color = '#9e9e9e';
      switch (t.estado.toLowerCase()) {
        case 'pendiente': color = '#ffc107'; break;
        case 'en progreso': color = '#2196f3'; break;
        case 'completada': color = '#4caf50'; break;
        case 'cancelada': color = '#f44336'; break;
      }
      this.rowColors.push(color);
  
      // Formatear fechas a dd/mm/yyyy
      const formatDate = (date: Date) =>
        date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
      const tooltipHtml = `
        <div style="padding:8px; font-size:13px; max-width:300px;">
          <strong>${t.nombre}</strong><br>
          ${t.descripcion ? `<em>${t.descripcion}</em><br>` : ''}
          <strong>Obra Civil:</strong> ${t.obraCivil.nombre}<br>
          <strong>Estado:</strong> ${t.estado}<br>
          <strong>Prioridad:</strong> ${t.prioridad}<br>
          <strong>Fecha Inicio:</strong> ${formatDate(start)}<br>
          <strong>Fecha Fin:</strong> ${formatDate(end)}<br>
          <strong>Duración:</strong> ${durDias} día(s)
        </div>
      `;
  
      this.chartData.push([t.nombre, start, end, tooltipHtml]);
    });
  
    this.chartOptions.colors = this.rowColors;
    this.chart = {
      title: 'Diagrama de Timeline de la Obra',
      type: 'Timeline',
      data: this.chartData,
      columns: this.chartColumns,
      options: this.chartOptions
    };
  }
  
}
