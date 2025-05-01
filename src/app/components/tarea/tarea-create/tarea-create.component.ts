// src/app/components/tarea/tarea-create/tarea-create.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TareaService } from '../../../services/tarea/tarea.service';
import { ObracivilService } from '../../../services/obracivil/obracivil.service';
import { Tarea } from '../../../models/tarea/tarea.model';
import { Obracivil } from '../../../models/obracivil/obracivil.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarea-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tarea-create.component.html',
  styleUrls: ['./tarea-create.component.scss']
})
export class TareaCreateComponent implements OnInit {
  tarea: Tarea = {
    nombre: '',
    descripcion: '',
    fechaInicio: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    fechaFin: new Date().toISOString().split('T')[0],
    estado: 'pendiente',
    prioridad: 'media',
    obraCivil: { id: 0, nombre: '' }
  };

  obrasCiviles: Obracivil[] = [];
  estados = ['pendiente', 'en progreso', 'completada', 'cancelada'];
  prioridades = ['baja', 'media', 'alta'];

  constructor(
    private tareaService: TareaService,
    private obraCivilService: ObracivilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarObrasCiviles();
  }

  cargarObrasCiviles(): void {
    this.obraCivilService.obtenerObras().subscribe(obras => {
      this.obrasCiviles = obras;
    });
  }

  crearTarea(): void {
    // Validar fechas
    if (new Date(this.tarea.fechaFin) < new Date(this.tarea.fechaInicio)) {
      alert('La fecha de fin no puede ser anterior a la fecha de inicio');
      return;
    }

    this.tareaService.crearTarea(this.tarea).subscribe(() => {
      this.router.navigate(['/tarea']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/tarea']);
  }
}