import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipoService } from '../../../services/equipo/equipo.service';
import { Equipo } from '../../../models/equipo/equipo.model';

@Component({
  selector: 'app-equipo-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipo-update.component.html',
  styleUrls: ['./equipo-update.component.scss']
})
export class EquipoUpdateComponent implements OnInit {
  equipo: Equipo = {
    codigoActivo: '',
    nombre: '',
    descripcion: '',
    unidadMedida: '',
    tipoEquipo: '',
    precioUnitario: 0,
    fechaAdquisicion: ''
  };

  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private equipoService: EquipoService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerEquipoPorId(this.id);
  }

  obtenerEquipoPorId(id: number): void {
    this.equipoService.obtenerEquipoPorId(id).subscribe((data) => {
      this.equipo = data;
    });
  }

  actualizarEquipo(): void {
    this.equipoService.actualizarEquipo(this.id, this.equipo).subscribe(() => {
      this.router.navigate(['/equipo']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/equipo']);
  }
}
