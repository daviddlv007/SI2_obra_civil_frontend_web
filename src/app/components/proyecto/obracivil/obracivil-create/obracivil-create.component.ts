import { Component, AfterViewInit, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../../services/usuario/usuario.service';
import { ObracivilService } from '../../../../services/obracivil/obracivil.service';
import { Obracivil } from '../../../../models/obracivil/obracivil.model';
import { Usuario } from '../../../../models/usuario/usuario.model';
import { ObracivilUsuarioService } from '../../../../services/obracivil-usuario/obracivil-usuario.service';
import { ObracivilUsuario } from '../../../../models/obracivil-usuario/obracivil-usuario.model';
import { Router } from '@angular/router';

import * as L from 'leaflet';

@Component({
  selector: 'app-obracivil-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './obracivil-create.component.html',
  styleUrl: './obracivil-create.component.scss',
})
export class ObracivilCreateComponent implements OnInit {
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
    tipoObra: 'VIVIENDA', // O cualquiera que quieras por defecto
    direccion: '',
    latitud: 0,
    longitud: 0,
    planoUrl: '',
    fechaTerminacionReal: undefined,
  };

  submitted: boolean = false;

  usuariosClientes: Usuario[] = [];
  usuariosEmpleados: Usuario[] = [];

  usuario: Usuario = {
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    genero: '',
    numeroIdentificacion: '',
    rol: { id: 0, nombre: '', descripcion: '' },
  };

  usuarioCliente: Usuario = {
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    genero: '',
    numeroIdentificacion: '',
    rol: { id: 0, nombre: '', descripcion: '' },
  };

  usuarioEncargado: Usuario = {
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    genero: '',
    numeroIdentificacion: '',
    rol: { id: 0, nombre: '', descripcion: '' },
  };

  idUsuarioCliente: number = 0;
  idUsuarioEmpleado: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private obraCivilService: ObracivilService,
    private obraCivilUsuarioService: ObracivilUsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarEncargado();
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
    // Inicializar el mapa con la ubicación predeterminada de Bolivia (en este caso Santa Cruz)
    const map = L.map('map').setView([-17.769553, -63.171463], 9); // Coordenadas de Bolivia (Santa Cruz)

    // Agregar una capa de mapa (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Crear un marcador sin sombra
    const marker = L.marker([-17.769553, -63.171463], {
      icon: L.icon({
        iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
    }).addTo(map);

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

  crearObraCivill() {
    console.log('obracivil', this.obraCivil);
    console.log('idcliente', this.idUsuarioCliente);
    console.log('idencargado', this.idUsuarioEmpleado);
    // Lógica para crear la obra civil, asignando el cliente y el empleado
  }

  crearObraCivil(): void {
    console.log('obracivil', this.obraCivil);
    this.obraCivilService
      .crearObra(this.obraCivil)
      .subscribe((nuevaObraCivil) => {
        console.log('NEW:', nuevaObraCivil);
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
            obraCivil: { id: nuevaObraCivil.id! },
            usuario: { id: clienteSeleccionado.id }, // Aquí pasamos el objeto completo de usuario
          };

          const obraCivilUsuarioEnc: ObracivilUsuario = {
            obraCivil: { id: nuevaObraCivil.id! },
            usuario: { id: empleadoSeleccionado.id }, // Aquí pasamos el objeto completo de usuario
          };

          console.log('Usuarios obraCivilUsuarioCli:', obraCivilUsuarioCli);
          console.log('Usuarios obraCivilUsuarioEnc:', obraCivilUsuarioEnc);

          // Crear la relación entre obra civil y el cliente
          this.obraCivilUsuarioService
            .crearObraCivilUsuario(obraCivilUsuarioCli)
            .subscribe();

          // Crear la relación entre obra civil y el empleado
          this.obraCivilUsuarioService
            .crearObraCivilUsuario(obraCivilUsuarioEnc)
            .subscribe();

          // Redirigir después de la creación
          this.router.navigate(['/obra-civil']);
        } else {
          console.error('Cliente o empleado no encontrado.');
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['/obra-civil']); // Redirige a la lista de personas
  }

  idEmpleadoChange(idempleado: number): void {
    this.idUsuarioEmpleado = idempleado;
  }

  onClienteChange() {
    console.log('Cliente seleccionado:', this.idUsuarioCliente);
  }
}
