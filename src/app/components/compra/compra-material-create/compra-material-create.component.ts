import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FilterService } from '../../../services/filter/filter.service';
import { PaginationService } from '../../../services/pagination/pagination.service';
import { Material } from '../../../models/material/material.model';
import { MaterialService } from '../../../services/material/material.service';
import { Proveedor } from '../../../models/proveedor/proveedor.model';
import { ProveedorService } from '../../../services/proveedor/proveedor.service';
import { CompraService } from '../../../services/compra/compra.service';
import { CompraMaterialService } from '../../../services/compra-material/compra-material.service';
import { Compra } from '../../../models/compra/compra.model';
//import { CompraMaterial } from '../../../models/compra-material/compra-material.model';

declare var bootstrap: any; // para acceder a la instancia de modal de Bootstrap

@Component({
  selector: 'app-compra-material-create',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './compra-material-create.component.html',
  styleUrl: './compra-material-create.component.scss',
})
export class CompraMaterialCreateComponent {
  @ViewChild('modalCrearMaterial') modalCrearMaterial!: ElementRef;
  // material
  materiales: Material[] = [];
  materialesFiltrados: Material[] = [];
  materialesPaginados: Material[] = [];

  textoBusqueda: string = '';
  //estadoSeleccionado: string = 'Todos'; // Nuevo
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  //mostrarModal: boolean = false;
  //proveedorAEliminarId: number | null = null;

  /////////////////////////////////////////////////////////////
  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = [];
  proveedoresPaginados: Proveedor[] = [];
  //textoBusqueda: string = '';
  estadoSeleccionado: string = 'Todos'; // Nuevo

  mostrarModal: boolean = false;

  //compraID: number | null = null;

  proveedorID: number | null = null;
  total: number | null = null;

  proveedorSeleccionado: Proveedor = {
    id: 0,
    nombreCompleto: '',
    nitCi: '',
    telefono: '',
    correo: '',
    direccion: '',
    ciudad: '',
    pais: '',
    empresa: '',
    tipoProveedor: '',
    estado: '',
  };

  hoy = new Date().toISOString().split('T')[0]; // "2025-06-12"

  compra: Compra = {
    numeroCompra: 0,
    fecha: this.hoy,
    total: 0,
    estadoCompra: 'APROBADO',
    proveedor: {
      id: 0,
      nombreCompleto: '',
      nitCi: '',
      telefono: '',
      correo: '',
      direccion: '',
      ciudad: '',
      pais: '',
      empresa: '',
      tipoProveedor: '',
      estado: '', // Ej: "Activo" o "Inactivo"
    },
  };

  ///////////////////////////////////////////////////////////

  nuevoMaterial: Material = {
    codigoInventario: '',
    nombre: '',
    descripcion: '',
    unidadMedida: '',
    precioUnitario: 0,
    stockActual: 0,
    stockMinimo: 0,
    categoria: '',
  };

  constructor(
    private materialService: MaterialService,
    private proveedorService: ProveedorService,
    private compraService: CompraService,
    private compraMaterialService: CompraMaterialService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerMateriales();
    this.obtenerProveedores();
  }

  // MATERIALES
  //Crear Material
  validarYCrearMaterial(form: any): void {
    if (form.invalid) {
      alert('Todos los campos son obligatorios!!!');
      console.warn('Formulario inválido');
      return;
    }
    this.crearMaterial();
    console.log('Material creado: crearMaterial');
    this.cerrarModalCrearMaterial();
    console.log('Material creado: cerrarModalCrearMaterial');
    this.obtenerMateriales();
    console.log('Material creado: obtenerMateriales');
    this.limpiarFormularioMaterial(form);
    console.log('Material creado: limpiarFormularioMaterial');
  }

  crearMaterial(): void {
    this.materialService.crearMaterial(this.nuevoMaterial).subscribe({
      next: (materialCreado) => {
        console.log('Material creado:', materialCreado);
        //this.equipos.push(materialCreado);
      },
      error: (err) => {
        console.error('Error al crear el material:', err);
      },
    });
  }

  limpiarFormularioMaterial(form: any): void {
    form.resetForm(); // limpia formulario
    this.nuevoMaterial = {
      codigoInventario: '',
      nombre: '',
      descripcion: '',
      unidadMedida: '',
      precioUnitario: 0,
      stockActual: 0,
      stockMinimo: 0,
      categoria: '',
    };
  }

  cerrarModalCrearMaterial(): void {
    const modal = bootstrap.Modal.getInstance(
      this.modalCrearMaterial.nativeElement
    );
    modal.hide(); // Cierra el modal
  }

  // Obtener Materiales
  obtenerMateriales(): void {
    this.materialService.obtenerMateriales().subscribe((data) => {
      //console.log('Materiales', data);
      this.materiales = data;
      this.filtrarMateriales();
    });
  }

  filtrarMateriales(): void {
    let resultado = [...this.materiales];

    // Filtro por texto
    resultado = this.filterService.filtrar(resultado, this.textoBusqueda);

    this.materialesFiltrados = resultado;
    this.paginaActual = 1;
    this.calcularPaginacionMateriales();
  }

  calcularPaginacionMateriales(): void {
    const paginacion = this.paginationService.paginate(
      this.materialesFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.materialesPaginados = paginacion.paginatedData;
  }

  cambiarPaginaMateriales(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarmaterialesPaginados();
  }

  actualizarmaterialesPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.materialesFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.materialesPaginados = paginacion.paginatedData;
  }

  // Proveedores
  obtenerProveedores(): void {
    this.proveedorService
      .obtenerProveedoresPorTipoMaterial()
      .subscribe((data) => {
        this.proveedores = data;
        this.filtrarProveedores();
      });
  }

  filtrarProveedores(): void {
    let resultado = [...this.proveedores];

    // Filtro por texto
    resultado = this.filterService.filtrar(resultado, this.textoBusqueda);

    this.proveedoresFiltrados = resultado;
    this.paginaActual = 1;
    this.calcularPaginacionProveedores();
  }

  calcularPaginacionProveedores(): void {
    const paginacion = this.paginationService.paginate(
      this.proveedoresFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.proveedoresPaginados = paginacion.paginatedData;
  }

  cambiarPaginaProveedores(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarProveedoresPaginados();
  }

  actualizarProveedoresPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.proveedoresFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.proveedoresPaginados = paginacion.paginatedData;
  }

  carrito: any[] = [];

  // Métodos del carrito
  agregarACarrito(item: any, tipo: string) {
    const existe = this.carrito.find(
      (i) => i.id === item.id && i.tipo === tipo
    );

    if (existe) {
      existe.cantidad += 1;
      existe.subtotal = existe.cantidad * existe.precioUnitario;
    } else {
      this.carrito.push({
        ...item,
        tipo,
        cantidad: 1,
        subtotal: item.precioUnitario,
      });
    }
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
  }

  actualizarSubtotal(item: any) {
    item.subtotal = item.cantidad * item.precioUnitario;
  }

  calcularTotal(): number {
    let tot = this.carrito.reduce((total, item) => total + item.subtotal, 0);
    this.total = tot;
    //return this.carrito.reduce((total, item) => total + item.subtotal, 0);
    return tot;
  }

  vaciarCarrito() {
    this.carrito = [];
  }

  //Realizar Compra
  confirmarCompra() {
    console.log('Carrito confirmada:', this.carrito);
    console.log('Total:', this.total);
    console.log('IDProveedor:', this.proveedorID);

    if (this.proveedorID == null) {
      alert('Debe seleccionar un Proveedor');
    } else {
      this.cargarCompra();
      this.crearCompra();
      //this.vaciarCarrito();
      alert('Compra registrada correctamente');
      this.router.navigate(['/compra']);
    }
  }

  cargarCompra() {
    this.compra.total = this.total!;
    this.compra.proveedor = this.proveedorSeleccionado;
  }

  compraNueva!: Compra;
  //material!: Material;

  crearCompra(): void {
    this.compraService.crearCompra(this.compra).subscribe((compraCreada) => {
      this.compraNueva = compraCreada;

      //console.log('Carritoooo:', this.carrito);
      // Por cada item del carrito, crea una CompraMaterial
      this.carrito.forEach((item) => {
        const material: Material = {
          id: item.id,
          codigoInventario: item.codigoInventario,
          nombre: item.nombre,
          descripcion: item.descripcion,
          unidadMedida: item.unidadMedida,
          precioUnitario: item.precioUnitario,
          stockActual: item.stockActual,
          stockMinimo: item.stockMinimo,
          categoria: item.categoria,
        };
        //console.log('forEach:', material);
        const compraMaterial = {
          compra: this.compraNueva,
          material: material,
          precioUnitario: item.precioUnitario,
          cantidad: item.cantidad,
          subTotal: item.subtotal,
        };

        this.compraMaterialService
          .crearCompraMaterial(compraMaterial)
          .subscribe(() => {
            console.log('CompraMaterial creada para material', item.nombre);
          });
      });

      console.log('Compra creada:', this.compraNueva);
    });
  }

  // Otros Metodos
  volverACompras(): void {
    this.router.navigate(['/compra']);
  }

  seleccionarProveedor(): void {
    //this.permisoAEliminarId = id; // Guardamos el id de la Permiso a eliminar
    this.mostrarModal = true; // Mostramos el modal
  }

  seleccionarProveedorID(id: number): void {
    //this.permisoAEliminarId = id; // Guardamos el id de la Permiso a eliminar
    this.proveedorID = id; // Mostramos el modal
    this.obtenerProveedorPorId(id);
  }

  //proveedorSeleccionado(proveedorr: Proveedor) {
  //
  //}
  obtenerProveedorPorId(id: number): void {
    this.proveedorService.obtenerProveedorPorId(id).subscribe((data) => {
      this.proveedorSeleccionado = data;
    });
  }

  proveedorConfirmado(): void {
    if (this.proveedorID !== null) {
      //this.eliminarPermiso(this.permisoAEliminarId); // Realizamos la eliminación
      this.cerrarModal(); // Cerramos el modal
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false; // Ocultamos el modal
    //this.permisoAEliminarId = null; // Limpiamos el id de la Permiso a eliminar
  }
}
