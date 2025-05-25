import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EquipoService } from '../../../services/equipo/equipo.service';
import { Equipo } from '../../../models/equipo/equipo.model';

@Component({
  selector: 'app-equipo-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './equipo-create.component.html',
  styleUrls: ['./equipo-create.component.scss']
})
export class EquipoCreateComponent implements OnInit {
  equipo: Equipo = {
    codigoActivo: '',
    nombre: '',
    descripcion: '',
    unidadMedida: '',
    tipoEquipo: '',
    precioUnitario: 0,
    fechaAdquisicion: ''
  };

  constructor(
    private equipoService: EquipoService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  crearEquipo(): void {
    this.equipoService.crearEquipo(this.equipo).subscribe(() => {
      this.router.navigate(['/equipo']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/equipo']);
  }
}
