import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { TareaService } from '../../../services/tarea/tarea.service';
import { ObracivilService } from '../../../services/obracivil/obracivil.service';
import { ServicioService } from '../../../services/servicio/servicio.service';
import { EmpleadoService } from '../../../services/empleado/empleado.service';
import { EquipoService } from '../../../services/equipo/equipo.service';
import { MaterialService } from '../../../services/material/material.service';

import { Tarea } from '../../../models/tarea/tarea.model';
import { Obracivil } from '../../../models/obracivil/obracivil.model';
import { Servicio } from '../../../models/servicio/servicio.model';
import { Empleado } from '../../../models/empleado/empleado.model';
import { Equipo } from '../../../models/equipo/equipo.model';
import { Material } from '../../../models/material/material.model';

import { ServicioTareaService } from '../../../services/servicio-tarea/servicio-tarea.service';
import { EmpleadoTareaService } from '../../../services/empleado-tarea/empleado-tarea.service';
import { EquipoTareaService } from '../../../services/equipo-tarea/equipo-tarea.service';
import { MaterialTareaService } from '../../../services/material-tarea/material-tarea.service';

@Component({
  selector: 'app-tarea-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tarea-update.component.html',
  styleUrls: ['./tarea-update.component.scss']
})
export class TareaUpdateComponent implements OnInit {
  tarea: Tarea = {
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'pendiente',
    prioridad: 'media',
    obraCivil: { id: 0, nombre: '' },
  };

  obrasCiviles: Obracivil[] = [];
  serviciosDisponibles: Servicio[] = [];
  empleadosDisponibles: Empleado[] = [];
  materialesDisponibles: Material[] = [];
  equiposDisponibles: Equipo[] = [];

  estados = ['pendiente', 'en progreso', 'completada', 'cancelada'];
  prioridades = ['baja', 'media', 'alta'];

  selectedServicios: number[] = [];
selectedEmpleados: number[] = [];
selectedEquipos: number[] = [];
selectedMateriales: { id: number; cantidad: number }[] = [];


  constructor(
    private tareaService: TareaService,
    private obraCivilService: ObracivilService,
    private servicioService: ServicioService,
    private empleadoService: EmpleadoService,
    private equipoService: EquipoService,
    private materialService: MaterialService,
    private servicioTareaService: ServicioTareaService,
    private empleadoTareaService: EmpleadoTareaService,
    private equipoTareaService: EquipoTareaService,
    private materialTareaService: MaterialTareaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.tareaService.obtenerTareaPorId(id).subscribe((data) => {
        this.tarea = {
          ...data,
          fechaInicio: data.fechaInicio.split('T')[0],
          fechaFin: data.fechaFin.split('T')[0]
        };


      });
    }

    this.obraCivilService.obtenerObras().subscribe((data) => this.obrasCiviles = data);
    this.servicioService.obtenerServicios().subscribe((data) => this.serviciosDisponibles = data);
    this.empleadoService.obtenerEmpleados().subscribe((data) => this.empleadosDisponibles = data);
    this.materialService.obtenerMateriales().subscribe((data) => this.materialesDisponibles = data);
    this.equipoService.obtenerEquipos().subscribe((data) => this.equiposDisponibles = data);
  }

  actualizarTarea(): void {
    if (new Date(this.tarea.fechaFin) < new Date(this.tarea.fechaInicio)) {
      alert('La fecha de fin no puede ser anterior a la fecha de inicio');
      return;
    }

    if (this.tarea.id) {
      this.tareaService.actualizarTarea(this.tarea.id, this.tarea).subscribe(() => {
        this.router.navigate(['/tarea']);
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/tarea']);
  }
}
