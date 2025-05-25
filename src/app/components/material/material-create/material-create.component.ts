import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialService } from '../../../services/material/material.service';
import { Material } from '../../../models/material/material.model';

@Component({
  selector: 'app-material-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './material-create.component.html',
  styleUrl: './material-create.component.scss'
})
export class MaterialCreateComponent implements OnInit {
  material: Material = {
    codigoInventario: '',
    nombre: '',
    descripcion: '',
    unidadMedida: '',
    precioUnitario: 0,
    stockActual: 0,
    stockMinimo: 0,
    categoria: ''
  };

  constructor(
    private materialService: MaterialService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  crearMaterial(): void {
    this.materialService.crearMaterial(this.material).subscribe(() => {
      this.router.navigate(['/material']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/material']);
  }
}
