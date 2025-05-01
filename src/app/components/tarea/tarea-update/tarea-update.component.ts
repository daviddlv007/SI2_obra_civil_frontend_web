// src/app/components/tarea/tarea-update/tarea-update.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TareaService } from '../../../services/tarea/tarea.service';
import { ObracivilService } from '../../../services/obracivil/obracivil.service';
import { Tarea } from '../../../models/tarea/tarea.model';
import { Obracivil } from '../../../models/obracivil/obracivil.model';

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
    obraCivil: { id: 0, nombre: '' }
  };

  obrasCiviles: Obracivil[] = [];
  estados = ['pendiente', 'en progreso', 'completada', 'cancelada'];
  prioridades = ['baja', 'media', 'alta'];

  constructor(
    private tareaService: TareaService,
    private obraCivilService: ObracivilService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.tareaService.obtenerTareaPorId(id).subscribe((data) => {
        // Asegurar que las fechas estén en formato correcto para el input date
        this.tarea = {
          ...data,
          fechaInicio: data.fechaInicio.split('T')[0],
          fechaFin: data.fechaFin.split('T')[0]
        };
      });
    }

    this.obraCivilService.obtenerObras().subscribe((data) => {
      this.obrasCiviles = data;
    });
  }

  actualizarTarea(): void {
    // Validar fechas
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