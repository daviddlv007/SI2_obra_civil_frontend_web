import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompraMaterial } from '../../../models/compra-material/compra-material.model';
import { CompraMaterialService } from '../../../services/compra-material/compra-material.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import { Compra } from '../../../models/compra/compra.model';
import { CompraService } from '../../../services/compra/compra.service';
import { CompraServicio } from '../../../models/compra-servicio/compra-servicio.model';
import { CompraEquipo } from '../../../models/compra-equipo/compra-equipo.model';
import { CompraServicioService } from '../../../services/compra-servicio/compra-servicio.service';
import { CompraEquipoService } from '../../../services/compra-equipo/compra-equipo.service';

@Component({
  selector: 'app-compra-show',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compra-show.component.html',
  styleUrl: './compra-show.component.scss',
})
export class CompraShowComponent implements OnInit {
  compraMateriales: CompraMaterial[] = [];
  compraServicios: CompraServicio[] = [];
  compraEquipos: CompraEquipo[] = [];

  compra!: Compra;

  ID: number = 0;
  TIPO: string = '';

  constructor(
    private compraMaterialService: CompraMaterialService,
    private compraServicioService: CompraServicioService,
    private compraEquipoService: CompraEquipoService,
    private compraService: CompraService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerIdYTipo();
    this.obtenerDetalleCompras();
    this.obtenerCompraPorId();
  }

  obtenerIdYTipo(): void {
    this.ID = Number(this.route.snapshot.paramMap.get('id'));
    this.TIPO = String(this.route.snapshot.paramMap.get('tipo'));
  }

  /*obtenerDetalleCompras(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.compraMaterialService.obtenerComprasPorId(id).subscribe((data) => {
        console.log('LisDetalle:', data);
        this.compraMateriales = data;
      });
    }
  }*/

  /*obtenerDetalleCompras(): void {
    if (this.ID) {
      if (this.TIPO == 'MATERIAL') {
        this.compraMaterialService
          .obtenerComprasPorId(this.ID)
          .subscribe((data) => {
            console.log('LisDetalle:', data);
            this.compraMateriales = data;
          });
      }
      if (this.TIPO == 'EQUIPO') {
        this.compraEquipoService
          .obtenerComprasPorId(this.ID)
          .subscribe((data) => {
            console.log('LisDetalle:', data);
            this.compraEquipos = data;
          });
      }
      if (this.TIPO == 'SERVICIO') {
        this.compraServicioService
          .obtenerComprasPorId(this.ID)
          .subscribe((data) => {
            console.log('LisDetalle:', data);
            this.compraServicios = data;
          });
      }
    }
  }*/

  obtenerDetalleCompras(): void {
    console.log('ID:', this.ID);
    console.log('TIPO:', this.TIPO);
    if (!this.ID) return;

    switch (this.TIPO) {
      case 'MATERIAL':
        this.compraMaterialService
          .obtenerComprasPorId(this.ID)
          .subscribe((data) => {
            console.log('LisDetalle:', data);
            this.compraMateriales = data;
          });
        break;

      case 'EQUIPO':
        this.compraEquipoService
          .obtenerComprasPorId(this.ID)
          .subscribe((data) => {
            console.log('LisDetalle:', data);
            this.compraEquipos = data;
          });
        break;

      case 'SERVICIO':
        this.compraServicioService
          .obtenerComprasPorId(this.ID)
          .subscribe((data) => {
            console.log('LisDetalle:', data);
            this.compraServicios = data;
          });
        break;

      default:
        console.warn('Tipo de compra desconocido:', this.TIPO);
    }
  }

  obtenerCompraPorId(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.compraService.obtenerCompraPorId(id).subscribe((data) => {
        console.log('compradetalle:', data);
        this.compra = data;
      });
    }
  }

  //this.router.navigate(['/compra-create']);

  volverACompras(): void {
    this.router.navigate(['/compra']);
  }

  ///

  exportToExcel(): void {
    try {
      // Obtener la tabla por ID
      const element = document.getElementById('purchase-table');

      if (!element) {
        console.error('No se encontró la tabla con ID purchase-table');
        return;
      }

      // Crear hoja de trabajo
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      // Crear libro de trabajo
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'DetalleCompra');

      // Exportar archivo
      XLSX.writeFile(wb, 'detalle_compra.xlsx');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      // Puedes mostrar un mensaje al usuario aquí si lo deseas
    }
  }

  exportToPDF(): void {
    try {
      const doc = new jsPDF();

      // Título del documento
      doc.setFontSize(18);
      doc.text('Detalle de Compra', 14, 20);

      /*// Información de la compra
      doc.setFontSize(12);
      doc.text(`ID de Compra: #12345`, 14, 30);
      doc.text(`Fecha: 15/06/2025`, 14, 36);
      doc.text(`Cliente: Juan Pérez`, 14, 42);*/

      // Formatear fecha en dd/MM/yyyy
      const fechaFormateada = this.compra?.fecha
        ? new Date(this.compra.fecha).toLocaleDateString('es-ES')
        : '';

      // Información dinámica de la compra
      doc.setFontSize(12);
      doc.text(`ID de Compra: #${this.compra?.numeroCompra ?? ''}`, 14, 30);
      doc.text(`Fecha: ${fechaFormateada}`, 14, 36);
      doc.text(`Proveedor: ${this.compra?.proveedor?.empresa ?? ''}`, 14, 42);

      // Configuración de la tabla
      autoTable(doc, {
        html: '#purchase-table',
        startY: 50,
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
        },
        styles: {
          fontSize: 9,
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 'auto' },
        },
      });

      doc.save(`detalle_compra ${this.compra?.numeroCompra ?? ''} .pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      // Aquí puedes agregar notificación al usuario
    }
  }

  print(): void {
    const printContent = document.querySelector(
      '.print-content'
    ) as HTMLElement;
    const originalContents = printContent.innerHTML;

    // Crear una ventana nueva para imprimir
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Comprobante de Compra</title>
          <style>
            @page { size: auto; margin: 5mm; }
            body { font-family: Arial; font-size: 12px; padding: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { padding: 4px; text-align: left; border: 1px solid #ddd; }
            .text-center { text-align: center; }
            .text-end { text-align: right; }
            .table-dark th { background-color: #343a40; color: white; }
            .boleta-container { width: 80mm; margin: 0 auto; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert(
        'El bloqueador de ventanas emergentes puede estar activado. Por favor desactívalo para esta página.'
      );
    }
  }
}
