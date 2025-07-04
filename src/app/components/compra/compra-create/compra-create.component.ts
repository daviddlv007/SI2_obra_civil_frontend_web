import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { MaterialService } from '../../../services/material/material.service';
import { Material } from '../../../models/material/material.model';
import { Router } from '@angular/router';
import { FilterService } from '../../../services/filter/filter.service';
import { PaginationService } from '../../../services/pagination/pagination.service';
import { Equipo } from '../../../models/equipo/equipo.model';
import { EquipoService } from '../../../services/equipo/equipo.service';
import { Servicio } from '../../../models/servicio/servicio.model';
import { ServicioService } from '../../../services/servicio/servicio.service';
import { Proveedor } from '../../../models/proveedor/proveedor.model';
import { ProveedorService } from '../../../services/proveedor/proveedor.service';
import { CompraService } from '../../../services/compra/compra.service';
import { CompraMaterialService } from '../../../services/compra-material/compra-material.service';
import { Compra } from '../../../models/compra/compra.model';
import { CompraMaterial } from '../../../models/compra-material/compra-material.model';

@Component({
  selector: 'app-compra-create',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './compra-create.component.html',
  styleUrl: './compra-create.component.scss',
})
export class CompraCreateComponent {
  //compra: Compra | null = null;
  // material
  materiales: Material[] = [];
  materialesFiltrados: Material[] = [];
  materialesPaginados: Material[] = [];

  // equipos
  equipos: Equipo[] = [];
  equiposFiltrados: Equipo[] = [];
  equiposPaginados: Equipo[] = [];

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
  //paginaActual: number = 1;
  //elementosPorPagina: number = 5;
  //totalPaginas: number = 0;
  mostrarModal: boolean = false;
  //proveedorAEliminarId: number | null = null;

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

  constructor(
    private materialService: MaterialService,
    private equipoService: EquipoService,
    private servicioService: ServicioService,
    private proveedorService: ProveedorService,
    private compraService: CompraService,
    private compraMaterialService: CompraMaterialService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerMateriales();
    this.obtenerEquipos();
    this.obtenerServicios();
    this.obtenerProveedores();
  }

  //MATERIALES
  obtenerMateriales(): void {
    this.materialService.obtenerMateriales().subscribe((data) => {
      console.log('Materiales', data);
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

  //EQUIPOS
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

  //SERVICIOS
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

  //PROVEEDOR Proveedores proveedor proveedores
  obtenerProveedores(): void {
    this.proveedorService.obtenerProveedores().subscribe((data) => {
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

  // Datos estáticos de ejemplo
  /*materiales = [
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
  ];*/

  /*equipos = [
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
  ];*/

  /*servicios = [
    {
      id: 1,
      codigo_servicio: 'SERV-001',
      nombre: 'Mantenimiento eléctrico',
      descripcion: 'Mantenimiento preventivo instalaciones eléctricas',
      precio_unitario: 150.0,
      duracion_estimada: 8.0,
    },
    // ... más servicios
  ];*/

  // Filtros
  //busquedaMaterial: string = '';
  //busquedaEquipo: string = '';
  //busquedaServicio: string = '';

  // Datos filtrados
  //materialesFiltrados = [...this.materiales];
  //equiposFiltrados = [...this.equipos];
  //serviciosFiltrados = [...this.servicios];

  // Carrito de compras
  carrito: any[] = [];

  // Métodos de filtrado
  /*
  filtrarMaterialess() {
    this.materialesFiltrados = this.materiales.filter(
      (m) =>
        m.nombre.toLowerCase().includes(this.busquedaMaterial.toLowerCase()) ||
        m.codigoInventario
          .toLowerCase()
          .includes(this.busquedaMaterial.toLowerCase())
    );
  }

  filtrarEquiposss() {
    this.equiposFiltrados = this.equipos.filter(
      (e) =>
        e.nombre.toLowerCase().includes(this.busquedaEquipo.toLowerCase()) ||
        e.codigoActivo.toLowerCase().includes(this.busquedaEquipo.toLowerCase())
    );
  }

  filtrarServicioss() {
    this.serviciosFiltrados = this.servicios.filter(
      (s) =>
        s.nombre.toLowerCase().includes(this.busquedaServicio.toLowerCase()) ||
        s.codigoServicio
          .toLowerCase()
          .includes(this.busquedaServicio.toLowerCase())
    );
  }
  */
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
  /*
  crearCompra(): void {
      this.compraService.crearCompra(this.compra).subscribe((nuevaCompra) => {
        this.carrito.forEach((car) => {
          const compraMaterial: CompraMaterial = {
            compra: { id: nuevaCompra.id },
            material: { id: permiso.id },
          };
          this.compraMaterialService.crearCompraMaterial(compraMaterial).subscribe();
        });
        this.router.navigate(['/compras']);
      });
    }*/

  confirmarCompra() {
    // Aquí iría la lógica para guardar la compra

    console.log('Compra confirmada:', this.carrito);
    console.log('Total:', this.total);
    console.log('IDProveedor:', this.proveedorID);
    this.cargarCompra();
    this.crearCompra();
    //alert('Compra registrada correctamente');
    //this.vaciarCarrito();
  }

  cargarCompra() {
    this.compra.total = this.total!;
    this.compra.proveedorId = this.proveedorID!;

    this.compra.proveedor.id = this.proveedorSeleccionado.id!;
    this.compra.proveedor.ciudad = this.proveedorSeleccionado.ciudad;
    this.compra.proveedor.correo = this.proveedorSeleccionado.correo;
    this.compra.proveedor.direccion = this.proveedorSeleccionado.direccion;
    this.compra.proveedor.empresa = this.proveedorSeleccionado.empresa;
    this.compra.proveedor.estado = this.proveedorSeleccionado.estado;
    this.compra.proveedor.nitCi = this.proveedorSeleccionado.nitCi;
    this.compra.proveedor.nombreCompleto =
      this.proveedorSeleccionado.nombreCompleto;
    this.compra.proveedor.pais = this.proveedorSeleccionado.pais;
    this.compra.proveedor.telefono = this.proveedorSeleccionado.telefono;
    this.compra.proveedor.tipoProveedor =
      this.proveedorSeleccionado.tipoProveedor;
  }

  compraNueva!: Compra;
  material!: Material;

  crearCompra(): void {
    /*this.compraService.crearCompra(this.compra).subscribe(() => {
      this.router.navigate(['/compra']); // Redirige al componente principal después de crear
    });*/
    /*this.compraService.crearCompra(this.compra).subscribe((nuevaCompra) => {
      this.compraID =
        typeof nuevaCompra === 'object' ? nuevaCompra.id! : nuevaCompra!;
      console.log('ID de la nueva compra:', this.compraID);

      // Ejemplo: redirigir a la vista de detalle de esa compra
      //this.router.navigate(['/compra']);
    });*/

    /*this.compraService
      .crearCompra(this.compra)
      .subscribe((compraCreada: Compra) => {
        this.compraNueva = compraCreada;

        console.log('Compra creada:', this.compraNueva);
        // Por ejemplo, navegar o usarla en otra parte
        //this.router.navigate(['/permiso']);
      });*/
    //this.cargarCompra();
    this.compraService.crearCompra(this.compra).subscribe((compraCreada) => {
      this.compraNueva = compraCreada;

      // Por cada item del carrito, crea una CompraMaterial
      this.carrito.forEach((item) => {
        /*this.material.id = item.id;
        this.material.codigoInventario = item.codigoInventario;
        this.material.nombre = item.nombre;
        this.material.descripcion = item.descripcion;
        this.material.unidadMedida = item.unidadMedida;
        this.material.precioUnitario = item.precioUnitario;
        this.material.stockActual = item.stockActual;
        this.material.stockMinimo = item.stockMinimo;
        this.material.categoria = item.categoria;*/

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
      // Por ejemplo, navegar o usarla en otra parte
      //this.router.navigate(['/permiso']);
    });
  }

  irACrearCompra() {
    // Navegar a formulario de creación de compra
    console.log('Navegar a crear compra');
  }

  irACompras(): void {
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
