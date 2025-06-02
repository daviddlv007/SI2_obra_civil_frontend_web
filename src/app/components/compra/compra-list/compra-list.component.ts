import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compra-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compra-list.component.html',
  styleUrl: './compra-list.component.scss',
})
export class CompraListComponent {
  // Datos estáticos de ejemplo
  materiales = [
    {
      id: 1,
      codigo_inventario: 'MAT-001',
      nombre: 'Tornillos de acero',
      descripcion: 'Tornillos de acero inoxidable 1/2"',
      unidad_medida: 'unidad',
      precio_unitario: 0.5,
      stock_actual: 100,
      stock_minimo: 200,
      categoria: 'Ferretería',
    },
    // ... más materiales
  ];

  equipos = [
    {
      id: 1,
      codigo_activo: 'EQP-001',
      nombre: 'Laptop HP EliteBook',
      descripcion: 'Laptop i7 16GB RAM 512GB SSD',
      unidad_medida: 'unidad',
      tipo_equipo: 'Computación',
      precio_unitario: 1200.0,
      fecha_adquisicion: null,
    },
    // ... más equipos
  ];

  servicios = [
    {
      id: 1,
      codigo_servicio: 'SERV-001',
      nombre: 'Mantenimiento eléctrico',
      descripcion: 'Mantenimiento preventivo instalaciones eléctricas',
      precio_unitario: 150.0,
      duracion_estimada: 8.0,
    },
    // ... más servicios
  ];

  // Filtros
  busquedaMaterial: string = '';
  busquedaEquipo: string = '';
  busquedaServicio: string = '';

  // Datos filtrados
  materialesFiltrados = [...this.materiales];
  equiposFiltrados = [...this.equipos];
  serviciosFiltrados = [...this.servicios];

  // Carrito de compras
  carrito: any[] = [];

  // Métodos de filtrado
  filtrarMateriales() {
    this.materialesFiltrados = this.materiales.filter(
      (m) =>
        m.nombre.toLowerCase().includes(this.busquedaMaterial.toLowerCase()) ||
        m.codigo_inventario
          .toLowerCase()
          .includes(this.busquedaMaterial.toLowerCase())
    );
  }

  filtrarEquipos() {
    this.equiposFiltrados = this.equipos.filter(
      (e) =>
        e.nombre.toLowerCase().includes(this.busquedaEquipo.toLowerCase()) ||
        e.codigo_activo
          .toLowerCase()
          .includes(this.busquedaEquipo.toLowerCase())
    );
  }

  filtrarServicios() {
    this.serviciosFiltrados = this.servicios.filter(
      (s) =>
        s.nombre.toLowerCase().includes(this.busquedaServicio.toLowerCase()) ||
        s.codigo_servicio
          .toLowerCase()
          .includes(this.busquedaServicio.toLowerCase())
    );
  }

  // Métodos del carrito
  agregarACarrito(item: any, tipo: string) {
    const existe = this.carrito.find(
      (i) => i.id === item.id && i.tipo === tipo
    );

    if (existe) {
      existe.cantidad += 1;
      existe.subtotal = existe.cantidad * existe.precio_unitario;
    } else {
      this.carrito.push({
        ...item,
        tipo,
        cantidad: 1,
        subtotal: item.precio_unitario,
      });
    }
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
  }

  actualizarSubtotal(item: any) {
    item.subtotal = item.cantidad * item.precio_unitario;
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + item.subtotal, 0);
  }

  vaciarCarrito() {
    this.carrito = [];
  }

  confirmarCompra() {
    // Aquí iría la lógica para guardar la compra
    console.log('Compra confirmada:', this.carrito);
    alert('Compra registrada correctamente');
    this.vaciarCarrito();
  }

  irACrearCompra() {
    // Navegar a formulario de creación de compra
    console.log('Navegar a crear compra');
  }
}
