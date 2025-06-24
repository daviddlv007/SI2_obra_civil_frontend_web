import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../services/material/material.service';
import { Material } from '../../models/material/material.model';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-material-reporte',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './material-reporte.component.html',
  styleUrls: ['./material-reporte.component.scss']
})
export class MaterialReporteComponent implements OnInit {
  materiales: Material[] = [];
  materialesFiltrados: Material[] = [];

  categoria: string = '';
  soloBajoStock: boolean = false;

  categorias: string[] = [];

  constructor(private materialService: MaterialService) {}

  ngOnInit(): void {
    this.materialService.obtenerMateriales().subscribe(materiales => {
      this.materiales = materiales;
      this.extraerCategorias();
      this.filtrar();
    });
  }

  extraerCategorias(): void {
    const categoriasValidas = this.materiales
      .map(m => m.categoria)
      .filter((c): c is string => typeof c === 'string' && c.trim() !== '');

    this.categorias = Array.from(new Set(categoriasValidas));
  }


  filtrar(): void {
    this.materialesFiltrados = this.materiales.filter(m => {
      const coincideCategoria = !this.categoria || m.categoria === this.categoria;
      const bajoStock = !this.soloBajoStock || m.stockActual < m.stockMinimo;
      return coincideCategoria && bajoStock;
    });
  }

  exportarExcel(): void {
    const data = this.materialesFiltrados.map(m => ({
      Código: m.codigoInventario,
      Nombre: m.nombre,
      Descripción: m.descripcion,
      Unidad: m.unidadMedida,
      Precio: m.precioUnitario,
      Stock: m.stockActual,
      'Stock Mínimo': m.stockMinimo,
      Categoría: m.categoria,
      'Valor Total': (m.precioUnitario * m.stockActual).toFixed(2)
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'Materiales': worksheet }, SheetNames: ['Materiales'] };
    const buffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `reporte-materiales.xlsx`);
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Reporte de Materiales`, 14, 15);

    const filas = this.materialesFiltrados.map(m => ([
      m.codigoInventario,
      m.nombre,
      m.unidadMedida,
      m.precioUnitario.toFixed(2),
      m.stockActual,
      m.stockMinimo,
      m.categoria || '',
      (m.precioUnitario * m.stockActual).toFixed(2)
    ]));

    autoTable(doc, {
      startY: 25,
      head: [[
        'Código',
        'Nombre',
        'Unidad',
        'Precio Unit.',
        'Stock',
        'Mínimo',
        'Categoría',
        'Valor Total'
      ]],
      body: filas,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [46, 204, 113], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 25 },
      theme: 'striped'
    });

    doc.save(`reporte-materiales.pdf`);
  }

  exportarHTML(): void {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte Materiales</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #27ae60; border-bottom: 2px solid #2ecc71; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; border-bottom: 1px solid #ccc; text-align: left; }
          th { background-color: #2ecc71; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>Reporte de Materiales</h1>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Unidad</th>
              <th>Precio Unitario</th>
              <th>Stock</th>
              <th>Stock Mínimo</th>
              <th>Categoría</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            ${this.materialesFiltrados.map(m => `
              <tr>
                <td>${m.codigoInventario}</td>
                <td>${m.nombre}</td>
                <td>${m.unidadMedida}</td>
                <td>${m.precioUnitario.toFixed(2)}</td>
                <td>${m.stockActual}</td>
                <td>${m.stockMinimo}</td>
                <td>${m.categoria || ''}</td>
                <td>${(m.precioUnitario * m.stockActual).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    FileSaver.saveAs(blob, `reporte-materiales.html`);
  }
}
