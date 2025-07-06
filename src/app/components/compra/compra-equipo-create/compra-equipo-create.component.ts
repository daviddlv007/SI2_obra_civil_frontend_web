import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FilterService } from '../../../services/filter/filter.service';
import { PaginationService } from '../../../services/pagination/pagination.service';
import { Equipo } from '../../../models/equipo/equipo.model';
import { EquipoService } from '../../../services/equipo/equipo.service';
import { Proveedor } from '../../../models/proveedor/proveedor.model';
import { ProveedorService } from '../../../services/proveedor/proveedor.service';
import { CompraService } from '../../../services/compra/compra.service';
import { CompraEquipoService } from '../../../services/compra-equipo/compra-equipo.service';
import { Compra } from '../../../models/compra/compra.model';
//import { CompraMaterial } from '../../../models/compra-material/compra-material.model';

declare var bootstrap: any; // para acceder a la instancia de modal de Bootstrap

@Component({
  selector: 'app-compra-equipo-create',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './compra-equipo-create.component.html',
  styleUrl: './compra-equipo-create.component.scss',
})
export class CompraEquipoCreateComponent {
  @ViewChild('modalCrearEquipo') modalCrearEquipo!: ElementRef;
  // equipos
  equipos: Equipo[] = [];
  equiposFiltrados: Equipo[] = [];
  equiposPaginados: Equipo[] = [];

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

  compraID: number | null = null;

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

  nuevoEquipo: Equipo = {
    codigoActivo: '',
    nombre: '',
    descripcion: '',
    unidadMedida: '',
    tipoEquipo: '',
    precioUnitario: 0,
    fechaAdquisicion: this.hoy,
  };

  constructor(
    private equipoService: EquipoService,
    private proveedorService: ProveedorService,
    private compraService: CompraService,
    private compraEquipoService: CompraEquipoService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerEquipos();
    this.obtenerProveedores();
  }

  //EQUIPOS
  //Crear Equipo
  validarYCrearEquipo(form: any): void {
    if (form.invalid) {
      alert('Todos los campos son obligatorios!!!');
      console.warn('Formulario inválido');
      return;
    }
    this.crearEquipo();
    console.log('Equipo creado: crearEquipo');
    this.cerrarModalCrearEqipo();
    console.log('Equipo creado: cerrarModalCrearEqipo');
    this.obtenerEquipos();
    console.log('Equipo creado: obtenerEquipos');
    this.limpiarFormularioEquipo(form);
    console.log('Equipo creado: limpiarFormularioEquipo');
  }

  crearEquipo(): void {
    this.equipoService.crearEquipo(this.nuevoEquipo).subscribe({
      next: (equipoCreado) => {
        console.log('Equipo creado:', equipoCreado);
        //this.equipos.push(equipoCreado);
      },
      error: (err) => {
        console.error('Error al crear el equipo:', err);
      },
    });
  }

  limpiarFormularioEquipo(form: any): void {
    form.resetForm(); // limpia formulario
    this.nuevoEquipo = {
      codigoActivo: '',
      nombre: '',
      descripcion: '',
      unidadMedida: '',
      tipoEquipo: '',
      precioUnitario: 0,
      fechaAdquisicion: this.hoy,
    };
  }

  cerrarModalCrearEqipo(): void {
    const modal = bootstrap.Modal.getInstance(
      this.modalCrearEquipo.nativeElement
    );
    modal.hide(); // Cierra el modal
  }

  // Obtener Equipos
  obtenerEquipos(): void {
    this.equipoService.obtenerEquipos().subscribe((data) => {
      this.equipos = data;
      this.filtrarEquipos();
    });
  }

  filtrarEquipos(): void {
    let resultado = [...this.equipos];

    // Filtro por texto
    resultado = this.filterService.filtrar(resultado, this.textoBusqueda);

    this.equiposFiltrados = resultado;
    this.paginaActual = 1;
    this.calcularPaginacionEquipos();
  }

  calcularPaginacionEquipos(): void {
    const paginacion = this.paginationService.paginate(
      this.equiposFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.equiposPaginados = paginacion.paginatedData;
  }

  cambiarPaginaEquipos(direccion: 'previous' | 'next'): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion,
      this.totalPaginas
    );
    this.actualizarequiposPaginados();
  }

  actualizarequiposPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.equiposFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.equiposPaginados = paginacion.paginatedData;
  }

  //Proveedores
  obtenerProveedores(): void {
    this.proveedorService
      .obtenerProveedoresPorTipoEquipo()
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

  //Carrito
  carrito: any[] = [];

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
    console.log('Compra confirmada:', this.carrito);
    console.log('Total:', this.total);
    console.log('IDProveedor:', this.proveedorID);

    if (this.proveedorID == null) {
      alert('Debe seleccionar un proveedor');
    } else {
      this.cargarCompra();
      this.crearCompra();
      alert('Compraregistrada correctamente');
      this.router.navigate(['/compra']);
    }
  }

  cargarCompra() {
    this.compra.total = this.total!;
    this.compra.proveedor = this.proveedorSeleccionado;
  }

  compraNueva!: Compra;
  //equipo!: Equipo;

  crearCompra(): void {
    //this.cargarCompra();
    this.compraService.crearCompra(this.compra).subscribe((compraCreada) => {
      this.compraNueva = compraCreada;

      // Por cada item del carrito, crea una CompraMaterial
      this.carrito.forEach((item) => {
        /*const equipo: Equipo = {
          id: item.id,
          codigoActivo: item.codigoActivo!,
          nombre: item.nombre!,
          descripcion: item.descripcion!,
          unidadMedida: item.unidadMedida!,
          tipoEquipo: item.tipoEquipo!,
          precioUnitario: item.precioUnitario!,
          fechaAdquisicion: item.fechaAdquisicion!,
        };*/

        const compraEquipo = {
          compra: this.compraNueva,
          //equipo: equipo,
          equipo: {
            id: item.id,
            codigoActivo: item.codigoActivo!,
            nombre: item.nombre!,
            descripcion: item.descripcion,
            unidadMedida: item.unidadMedida!,
            tipoEquipo: item.tipoEquipo!,
            precioUnitario: item.precioUnitario!,
            fechaAdquisicion: item.fechaAdquisicion!,
          },
          precioUnitario: item.precioUnitario!,
          cantidad: item.cantidad!,
          subTotal: item.subtotal!,
        };

        this.compraEquipoService
          .crearCompraEquipo(compraEquipo)
          .subscribe(() => {
            console.log('CompraEquipo creada para equipo', item.nombre);
          });
      });

      console.log('Compra creada:', this.compraNueva);
      // Por ejemplo, navegar o usarla en otra parte
      //this.router.navigate(['/compra']);
    });
  }

  /*irACrearCompra() {
    // Navegar a formulario de creación de compra
    console.log('Navegar a crear compra');
  }*/

  //Otros Metodos
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
