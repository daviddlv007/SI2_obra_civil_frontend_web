import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';

@Component({
  selector: 'app-compra-update',
  standalone: true,
  imports: [],
  templateUrl: './compra-update.component.html',
  styleUrl: './compra-update.component.scss',
})
export class CompraUpdateComponent {
  constructor(private router: Router) {}

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

      // Información de la compra
      doc.setFontSize(12);
      doc.text(`ID de Compra: #12345`, 14, 30);
      doc.text(`Fecha: 15/06/2025`, 14, 36);
      doc.text(`Cliente: Juan Pérez`, 14, 42);

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

      doc.save('detalle_compra.pdf');
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
  //this.router.navigate(['/compra-create']);

  volverACompras(): void {
    this.router.navigate(['/compra']);
  }
}
