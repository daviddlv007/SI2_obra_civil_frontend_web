import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObracivilService } from '../../../../services/obracivil/obracivil.service';
import { ObracivilUsuarioService } from '../../../../services/obracivil-usuario/obracivil-usuario.service';
import { UsuarioService } from '../../../../services/usuario/usuario.service';
import { Obracivil } from '../../../../models/obracivil/obracivil.model';
import { ObracivilUsuario } from '../../../../models/obracivil-usuario/obracivil-usuario.model';
import { Usuario } from '../../../../models/usuario/usuario.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import * as L from 'leaflet';

@Component({
  selector: 'app-obracivil-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './obracivil-update.component.html',
  styleUrl: './obracivil-update.component.scss',
})
export class ObracivilUpdateComponent implements OnInit {
  obraCivil: Obracivil = {
    nombre: '',
    descripcion: '',
    costoEstimado: 0,
    costo: 0,
    presupuesto: 0,
    presupuestoDisponible: 0,
    fechaInicio: undefined,
    fechaFinEstimada: undefined,
    estado: 'En planificación',
    tipoObra: 'VIVIENDA',
    direccion: '',
    latitud: 0,
    longitud: 0,
    planoUrl: '',
    fechaTerminacionReal: undefined,
  };

  usuariosClientes: Usuario[] = [];
  usuariosEmpleados: Usuario[] = [];

  obraId: number = 0;

  idUsuarioCliente: number = 0;
  idUsuarioEmpleado: number = 0;

  submitted: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private obraCivilService: ObracivilService,
    private obraCivilUsuarioService: ObracivilUsuarioService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obraId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.obraId) {
      this.cargarObraCivil(this.obraId);
    }
    this.cargarClientes();
    this.cargarEncargado();
  }

  cargarObraCivil(id: number): void {
    this.obraCivilService.obtenerObraPorId(id).subscribe((data) => {
      console.log('obraCivil:', data);
      this.obraCivil = data;
    });

    this.obraCivilUsuarioService.obtenerRelacionesCli(id).subscribe((data) => {
      console.log('Cliente', data);
      this.idUsuarioCliente = data[0].usuario.id;
      console.log('Cliente', this.idUsuarioCliente);
    });
    this.obraCivilUsuarioService.obtenerRelacionesEmp(id).subscribe((data) => {
      console.log('Empleado', data);
      this.idUsuarioEmpleado = data[0].usuario.id;
      console.log('Empleado', this.idUsuarioEmpleado);
    });
  }

  cargarClientes(): void {
    this.usuarioService.getUsuariosPorRol('Cliente').subscribe((data) => {
      this.usuariosClientes = data;
    });
  }

  cargarEncargado(): void {
    this.usuarioService.getUsuariosPorRol('Empleado').subscribe((data) => {
      this.usuariosEmpleados = data;
    });
  }

  ngAfterViewInit(): void {
    // Crear el mapa de Leaflet después de que la vista esté completamente cargada
    //this.initMaps();
    // Esperamos un poco para que los elementos del DOM se rendericen completamente
    this.cdr.detectChanges();
    setTimeout(() => {
      this.initMaps();
    }, 600); // Pequeño retraso de 100ms
  }

  initMaps(): void {
    // Inicializar el mapa con la ubicación predeterminada de Bolivia (en este caso Santa Cruz)
    console.log('latitud:', this.obraCivil.latitud);
    console.log('longitud:', this.obraCivil.longitud);
    const map = L.map('map').setView(
      [this.obraCivil.latitud!, this.obraCivil.longitud!],
      11
    ); // Coordenadas de Bolivia (Santa Cruz)

    // Agregar una capa de mapa (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Crear un marcador sin sombra
    const marker = L.marker(
      [this.obraCivil.latitud!, this.obraCivil.longitud!],
      {
        icon: L.icon({
          iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        }),
      }
    ).addTo(map);

    // Escuchar el evento de clic en el mapa para actualizar las coordenadas
    map.on('click', (e: any) => {
      const lat = e.latlng.lat.toFixed(6); // Redondea a 6 decimales
      const lng = e.latlng.lng.toFixed(6); // Redondea a 6 decimales

      // Actualizar las coordenadas en el modelo obraCivil
      this.obraCivil.latitud = parseFloat(lat); // Convierte de nuevo a número
      this.obraCivil.longitud = parseFloat(lng); // Convierte de nuevo a número

      // Actualizar el marcador en la nueva ubicación
      marker.setLatLng([parseFloat(lat), parseFloat(lng)]); // Establece la nueva posición del marcador
    });
  }

  editarObraCivil(): void {
    console.log('obracivil', this.obraCivil);
    this.obraCivilService
      .actualizarObra(this.obraId, this.obraCivil)
      .subscribe((updatedObra) => {
        console.log('NEW:', updatedObra);
        console.log('Usuarios clientes:', this.usuariosClientes);
        console.log('Usuarios empleados:', this.usuariosEmpleados);
        console.log('ID cliente seleccionado:', this.idUsuarioCliente);
        console.log('ID empleado seleccionado:', this.idUsuarioEmpleado);
        // Buscar los usuarios completos usando el id
        const clienteSeleccionado = this.usuariosClientes.find(
          (cliente) => cliente.id === Number(this.idUsuarioCliente)
        );
        const empleadoSeleccionado = this.usuariosEmpleados.find(
          (empleado) => empleado.id === Number(this.idUsuarioEmpleado)
        );

        console.log('Usuarios clienteSeleccionado:', clienteSeleccionado);
        console.log('Usuarios empleadoSeleccionado:', empleadoSeleccionado);

        // Asegúrate de que los usuarios existen antes de proceder
        if (clienteSeleccionado && empleadoSeleccionado) {
          const obraCivilUsuarioCli: ObracivilUsuario = {
            obraCivil: { id: updatedObra.id! },
            usuario: { id: clienteSeleccionado.id }, // Aquí pasamos el objeto completo de usuario
          };

          const obraCivilUsuarioEnc: ObracivilUsuario = {
            obraCivil: { id: updatedObra.id! },
            usuario: { id: empleadoSeleccionado.id }, // Aquí pasamos el objeto completo de usuario
          };

          console.log('Usuarios obraCivilUsuarioCli:', obraCivilUsuarioCli);
          console.log('Usuarios obraCivilUsuarioEnc:', obraCivilUsuarioEnc);

          // Crear la relación entre obra civil y el cliente
          this.obraCivilUsuarioService
            .actualizarObraCivilUsuario(this.obraId, obraCivilUsuarioCli)
            .subscribe();

          // Crear la relación entre obra civil y el empleado
          this.obraCivilUsuarioService
            .actualizarObraCivilUsuario(this.obraId, obraCivilUsuarioEnc)
            .subscribe();

          // Redirigir después de la creación
          this.router.navigate(['/obra-civil']);
        } else {
          console.error('Cliente o empleado no encontrado.');
        }
      });
  }

  editarObraCivill(): void {
    this.obraCivilService
      .actualizarObra(this.obraId, this.obraCivil)
      .subscribe((updatedObra) => {
        console.log('Obra civil actualizada', updatedObra);
        this.router.navigate(['/obra-civil']); // Redirige a la lista después de la actualización
      });
  }

  cancelar(): void {
    this.router.navigate(['/obra-civil']); // Redirige a la lista de obras civiles
  }

  onClienteChange() {
    console.log('Cliente seleccionado:', this.idUsuarioCliente);
  }
}
