import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FilterService } from '../../../services/filter/filter.service';
import { PaginationService } from '../../../services/pagination/pagination.service';
import { Servicio } from '../../../models/servicio/servicio.model';
import { ServicioService } from '../../../services/servicio/servicio.service';
import { Proveedor } from '../../../models/proveedor/proveedor.model';
import { ProveedorService } from '../../../services/proveedor/proveedor.service';
import { CompraService } from '../../../services/compra/compra.service';
import { CompraServicioService } from '../../../services/compra-servicio/compra-servicio.service';
import { Compra } from '../../../models/compra/compra.model';
//import { CompraMaterial } from '../../../models/compra-material/compra-material.model';

declare var bootstrap: any; // para acceder a la instancia de modal de Bootstrap

@Component({
  selector: 'app-compra-servicio-create',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './compra-servicio-create.component.html',
  styleUrl: './compra-servicio-create.component.scss',
})
export class CompraServicioCreateComponent {
  @ViewChild('modalCrearServicio') modalCrearServicio!: ElementRef;
  // servicios
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];
  serviciosPaginados: Servicio[] = [];

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
  //proveedorAEliminarId: number | null = null;

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

  nuevoServicio: Servicio = {
    codigoServicio: '',
    nombre: '',
    descripcion: '',
    precioUnitario: 0,
    duracionEstimada: 0,
  };

  constructor(
    private servicioService: ServicioService,
    private proveedorService: ProveedorService,
    private compraService: CompraService,
    private compraServicioService: CompraServicioService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerServicios();
    this.obtenerProveedores();
  }

  //SERVICIOS

  //Crear Servicio
  validarYCrearServicio(form: any): void {
    if (form.invalid) {
      alert('Todos los campos son obligatorios!!!');
      console.warn('Formulario inválido');
      return;
    }
    this.crearServicio();
    console.log('Servicio creado: crearServicio');
    this.cerrarModalCrearServicio();
    console.log('Servicio creado: cerrarModalCrearServicio');
    this.obtenerServicios();
    console.log('Servicio creado: obtenerServicio');
    this.limpiarFormularioServicio(form);
    console.log('Servicio creado: limpiarFormularioServicio');
  }

  crearServicio(): void {
    this.servicioService.crearServicio(this.nuevoServicio).subscribe({
      next: (servicioCreado) => {
        console.log('Servicio creado:', servicioCreado);
        //this.servicio.push(servicioCreado);
      },
      error: (err) => {
        console.error('Error al crear el material:', err);
      },
    });
  }

  limpiarFormularioServicio(form: any): void {
    form.resetForm(); // limpia formulario
    this.nuevoServicio = {
      codigoServicio: '',
      nombre: '',
      descripcion: '',
      precioUnitario: 0,
      duracionEstimada: 0,
    };
  }

  cerrarModalCrearServicio(): void {
    const modal = bootstrap.Modal.getInstance(
      this.modalCrearServicio.nativeElement
    );
    modal.hide(); // Cierra el modal
  }

  // Obtener Servicios
  obtenerServicios(): void {
    this.servicioService.obtenerServicios().subscribe((data) => {
      this.servicios = data;
      this.filtrarServicios();
    });
  }

  filtrarServicios(): void {
    let resultado = [...this.servicios];

    // Filtro por texto
    resultado = this.filterService.filtrar(resultado, this.textoBusqueda);

    this.serviciosFiltrados = resultado;
    this.paginaActual = 1;
    this.calcularPaginacionServicios();
  }

  calcularPaginacionServicios(): void {
    const paginacion = this.paginationService.paginate(
      this.serviciosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.serviciosPaginados = paginacion.paginatedData;
  }

  cambiarPaginaServicios(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarserviciosPaginados();
  }

  actualizarserviciosPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.serviciosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.serviciosPaginados = paginacion.paginatedData;
  }

  //Proveedore
  obtenerProveedores(): void {
    this.proveedorService
      .obtenerProveedoresPorTipoServicio()
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

  confirmarCompra() {
    // Aquí iría la lógica para guardar la compra

    console.log('Compra confirmada:', this.carrito);
    console.log('Total:', this.total);
    console.log('IDProveedor:', this.proveedorID);

    if (this.proveedorID == null) {
      alert('Debe seleccionar un Proveedor');
    } else {
      this.cargarCompra();
      this.crearCompra();
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

      // Por cada item del carrito, crea una CompraMaterial
      this.carrito.forEach((item) => {
        /*const servicio: Servicio = {
          id: item.id,
          codigoServicio: item.codigoServicio,
          nombre: item.nombre,
          descripcion: item.descripcion,
          precioUnitario: item.precioUnitario,
          duracionEstimada: item.duracionEstimada,
        };*/

        const compraServicio = {
          compra: this.compraNueva,
          //servicio: servicio,
          servicio: {
            id: item.id,
            codigoServicio: item.codigoServicio,
            nombre: item.nombre,
            descripcion: item.descripcion,
            precioUnitario: item.precioUnitario,
            duracionEstimada: item.duracionEstimada,
          },
          precioUnitario: item.precioUnitario,
          cantidad: item.cantidad,
          subTotal: item.subtotal,
        };

        this.compraServicioService
          .crearCompraServicio(compraServicio)
          .subscribe(() => {
            console.log('CompraServicio creada para servicio', item.nombre);
          });
      });

      console.log('Compra creada:', this.compraNueva);
      // Por ejemplo, navegar o usarla en otra parte
      //this.router.navigate(['/compra']);
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
