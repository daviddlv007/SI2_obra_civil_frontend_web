import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialService } from '../../../services/material/material.service';
import { Material } from '../../../models/material/material.model';

@Component({
  selector: 'app-material-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './material-update.component.html',
  styleUrl: './material-update.component.scss'
})
export class MaterialUpdateComponent implements OnInit {
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

  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materialService: MaterialService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerMaterialPorId(this.id);
  }

  obtenerMaterialPorId(id: number): void {
    this.materialService.obtenerMaterialPorId(id).subscribe((data) => {
      this.material = data;
    });
  }

  actualizarMaterial(): void {
    this.materialService.actualizarMaterial(this.id, this.material).subscribe(() => {
      this.router.navigate(['/material']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/material']);
  }
}
