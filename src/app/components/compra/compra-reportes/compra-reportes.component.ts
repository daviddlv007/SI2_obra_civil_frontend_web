import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleChartsModule } from 'angular-google-charts';

import { CompraService } from '../../../services/compra/compra.service';
//import { jsPDF } from 'jspdf';
//import 'jspdf-autotable';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import { ChartType } from 'angular-google-charts';

declare var google: any;

interface ChartConfig {
  title: string;
  type: ChartType;
  data: (string | number)[][];
  columns: { type: string; label: string }[];
  options: any;
}

@Component({
  selector: 'app-compra-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleChartsModule],
  templateUrl: './compra-reportes.component.html',
  styleUrl: './compra-reportes.component.scss',
})
export class CompraReportesComponent implements OnInit {
  type = ChartType.PieChart;
  // Filtros
  filtros = {
    fechaInicio: '',
    fechaFin: '',
    tipo: '',
    estado: '',
  };

  // Datos para reportes
  resumen = {
    totalGastado: 0,
    comprasAprobadas: 0,
    comprasCanceladas: 0,
  };

  comprasFiltradas: any[] = [];
  reporteGenerado = false;

  // Configuración de Google Charts
  graficoData = [
    ['Tipo', 'Monto'],
    ['Materiales', 0],
    ['Equipos', 0],
    ['Servicios', 0],
  ];

  /*
  graficoOptions = {
    title: 'Distribución de Compras por Tipo',
    width: '100%',
    height: 400,
    pieHole: 0.4,
    is3D: false, // Cambia a false para mejor rendimiento
    colors: ['#4285F4', '#34A853', '#FBBC05'], // Colores distintivos
    backgroundColor: 'transparent',
    chartArea: {
      left: '5%',
      top: '15%',
      width: '90%',
      height: '80%',
    },
    legend: {
      position: 'right',
      alignment: 'center',
      textStyle: {
        color: '#333',
        fontSize: 12,
      },
    },
    titleTextStyle: {
      color: '#333',
      fontSize: 16,
      bold: true,
    },
    tooltip: {
      textStyle: {
        fontSize: 12,
      },
      showColorCode: true,
    },
    animation: {
      duration: 1000,
      easing: 'out',
      startup: true,
    },
  };
  */

  // Reemplaza tus propiedades actuales del gráfico con:
  chart: ChartConfig = {
    title: 'Distribución de Compras por Tipo',
    type: ChartType.PieChart,
    data: [],
    columns: [
      { type: 'string', label: 'Tipo' },
      { type: 'number', label: 'Monto' },
    ],
    options: {
      title: 'Distribución de Compras por Tipo',
      width: '100%',
      height: 400,
      pieHole: 0.4,
      colors: ['#4285F4', '#34A853', '#FBBC05'],
      backgroundColor: 'transparent',
      chartArea: {
        left: '5%',
        top: '15%',
        width: '90%',
        height: '80%',
      },
      legend: {
        position: 'right',
        alignment: 'center',
        textStyle: {
          color: '#333',
          fontSize: 12,
        },
      },
    },
  };
  constructor(private compraService: CompraService) {}

  private chartReady = false;
  ngOnInit() {
    // Inicializa con datos vacíos
    /*this.graficoData = [
      ['Tipo', 'Monto'],
      ['Materiales', 0],
      ['Equipos', 0],
      ['Servicios', 0],
    ];*/
    this.chart.data = [
      ['Materiales', 0],
      ['Equipos', 0],
      ['Servicios', 0],
    ];
    //this.loadGoogleCharts();
  }
  private loadGoogleCharts() {
    if (typeof google !== 'undefined') {
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(() => {
        this.chartReady = true;
        console.log('Google Charts cargado correctamente');
      });
    } else {
      console.error('Google Charts no se ha cargado correctamente');
    }
  }

  /*generarReporte() {
    this.compraService.getComprasConFiltros(this.filtros).subscribe({
      next: (data) => {
        console.log('DATA: ', data);

        this.comprasFiltradas = data;
        console.log('FILTRADOS:', this.comprasFiltradas);

        this.calcularResumen();
        this.actualizarDatosGrafico();
        this.reporteGenerado = true;
      },
      error: (err) => {
        console.error('Error al generar reporte:', err);
        // Puedes agregar manejo de errores visual aquí
      },
    });
  }*/

  generarReporte() {
    /*if (!this.chartReady) {
      console.warn('Google Charts no está listo');
      return;
    }*/
    this.compraService.getComprasConFiltros(this.filtros).subscribe({
      next: (response) => {
        //console.log('Datos recibidos:', response);
        this.comprasFiltradas = response.content; // Accedemos al array de compras
        //console.log('Compras filtradas:', this.comprasFiltradas);
        console.log('Datos recibidos:', this.comprasFiltradas);
        this.calcularResumen();
        this.actualizarDatosGrafico();
        this.reporteGenerado = true;

        console.log('Datos del gráfico:', this.chart.data);
        // Forzar actualización si es necesario
        //this.graficoData = [...this.graficoData];
        // Forzar re-renderizado
        /*setTimeout(() => {
          this.graficoData = [...this.graficoData];
        }, 0);*/
        /*console.log('Estado final:', {
          graficoData: this.graficoData,
          options: this.graficoOptions,
          reporteGenerado: this.reporteGenerado,
        });*/
      },
      error: (err) => {
        console.error('Error al generar reporte:', err);
      },
    });
  }

  private calcularResumen() {
    this.resumen = {
      totalGastado: this.comprasFiltradas.reduce((sum, c) => sum + c.total, 0),
      comprasAprobadas: this.comprasFiltradas.filter(
        (c) => c.estadoCompra === 'APROBADO'
      ).length,
      comprasCanceladas: this.comprasFiltradas.filter(
        (c) => c.estadoCompra === 'CANCELADA'
      ).length,
    };
  }

  /*
  private actualizarDatosGrafico() {
    console.log('Actualizando gráfico con datos:', this.comprasFiltradas); // Debug

    const materialTotal = Number(
      this.comprasFiltradas
        .filter((c) => c.proveedor.tipoProveedor === 'MATERIAL')
        .reduce((sum, c) => sum + Number(c.total), 0)
    );

    const equipoTotal = Number(
      this.comprasFiltradas
        .filter((c) => c.proveedor.tipoProveedor === 'EQUIPO')
        .reduce((sum, c) => sum + Number(c.total), 0)
    );

    const servicioTotal = Number(
      this.comprasFiltradas
        .filter((c) => c.proveedor.tipoProveedor === 'SERVICIO')
        .reduce((sum, c) => sum + Number(c.total), 0)
    );

    this.graficoData = [
      ['Tipo', 'Monto'],
      ['Materiales', materialTotal],
      ['Equipos', equipoTotal],
      ['Servicios', servicioTotal],
    ];

    console.log('Datos para el gráfico:', this.graficoData); // Debug
  }
  */

  /*
  private actualizarDatosGrafico() {
    console.log('Actualizando gráfico con datos:', this.comprasFiltradas); // Debug
    // Convertir a números explícitamente
    const materialTotal = Number(
      this.comprasFiltradas
        .filter((c) => c.proveedor.tipoProveedor === 'MATERIAL')
        .reduce((sum, c) => sum + Number(c.total), 0)
    );

    const equipoTotal = Number(
      this.comprasFiltradas
        .filter((c) => c.proveedor.tipoProveedor === 'EQUIPO')
        .reduce((sum, c) => sum + Number(c.total), 0)
    );

    const servicioTotal = Number(
      this.comprasFiltradas
        .filter((c) => c.proveedor.tipoProveedor === 'SERVICIO')
        .reduce((sum, c) => sum + Number(c.total), 0)
    );

    // Crear nueva referencia del array para forzar detección de cambios
    this.graficoData = [
      ['Tipo', 'Monto'],
      ['Materiales', materialTotal],
      ['Equipos', equipoTotal],
      ['Servicios', servicioTotal],
    ];

    // Forzar actualización del gráfico
    setTimeout(() => {
      this.graficoData = [...this.graficoData];
    }, 0);
    console.log('Datos para el gráfico:', this.graficoData); // Debug
  }
  */

  private actualizarDatosGrafico() {
    const materialTotal = Number(
      this.comprasFiltradas
        .filter((c) => c.proveedor.tipoProveedor === 'MATERIAL')
        .reduce((sum, c) => sum + Number(c.total), 0)
    );

    const equipoTotal = Number(
      this.comprasFiltradas
        .filter((c) => c.proveedor.tipoProveedor === 'EQUIPO')
        .reduce((sum, c) => sum + Number(c.total), 0)
    );

    const servicioTotal = Number(
      this.comprasFiltradas
        .filter((c) => c.proveedor.tipoProveedor === 'SERVICIO')
        .reduce((sum, c) => sum + Number(c.total), 0)
    );

    this.chart.data = [
      ['Materiales', materialTotal],
      ['Equipos', equipoTotal],
      ['Servicios', servicioTotal],
    ];

    // Forzar actualización
    this.chart = { ...this.chart };
  }

  exportarPDF() {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('Reporte de Compras', 15, 15);

    // Resumen
    doc.setFontSize(12);
    doc.text(`Total Gastado: $${this.resumen.totalGastado}`, 15, 25);
    doc.text(`Compras Aprobadas: ${this.resumen.comprasAprobadas}`, 15, 35);
    doc.text(`Compras Canceladas: ${this.resumen.comprasCanceladas}`, 15, 45);

    // Tabla
    /*(doc as any).autoTable({
      head: [['N° Compra', 'Fecha', 'Proveedor', 'Total', 'Estado']],
      body: this.comprasFiltradas.map((c) => [
        c.numeroCompra,
        new Date(c.fecha).toLocaleDateString(),
        c.proveedor.nombreCompleto,
        `$${c.total}`,
        c.estadoCompra,
      ]),
      startY: 55,
    });*/
    autoTable(doc, {
      head: [['N° Compra', 'Fecha', 'Proveedor', 'Total', 'Estado']],
      body: this.comprasFiltradas.map((c) => [
        c.numeroCompra,
        new Date(c.fecha).toLocaleDateString(),
        c.proveedor.nombreCompleto,
        `$${c.total}`,
        c.estadoCompra,
      ]),
      startY: 55,
    });

    doc.save('reporte-compras.pdf');
  }

  exportarExcel() {
    const ws = XLSX.utils.json_to_sheet(
      this.comprasFiltradas.map((c) => ({
        'N° Compra': c.numeroCompra,
        Fecha: new Date(c.fecha).toLocaleDateString(),
        Proveedor: c.proveedor.nombreCompleto,
        Total: c.total,
        Estado: c.estadoCompra,
        Tipo: c.proveedor.tipoProveedor,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Compras');
    XLSX.writeFile(wb, 'reporte-compras.xlsx');
  }

  limpiarFiltros() {
    this.filtros = {
      fechaInicio: '',
      fechaFin: '',
      tipo: '',
      estado: '',
    };
    this.reporteGenerado = false;
  }
}
