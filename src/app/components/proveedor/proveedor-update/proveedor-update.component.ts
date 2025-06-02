import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../../services/proveedor/proveedor.service';
import { Proveedor } from '../../../models/proveedor/proveedor.model';

@Component({
  selector: 'app-proveedor-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedor-update.component.html',
  styleUrl: './proveedor-update.component.scss'
})
export class ProveedorUpdateComponent implements OnInit {
  proveedor: Proveedor = {
    nombreCompleto: '',
    nitCi: '',
    telefono: '',
    correo: '',
    direccion: '',
    ciudad: '',
    pais: '',
    empresa: '',
    estado: 'Activo'
  };

  estados: string[] = ['Activo', 'Inactivo'];
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerProveedorPorId(this.id);
  }

  obtenerProveedorPorId(id: number): void {
    this.proveedorService.obtenerProveedorPorId(id).subscribe((data) => {
      this.proveedor = data;
    });
  }

  actualizarProveedor(): void {
    this.proveedorService.actualizarProveedor(this.id, this.proveedor).subscribe(() => {
      this.router.navigate(['/proveedor']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/proveedor']);
  }
}
