import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProveedorService } from '../../../services/proveedor/proveedor.service';
import { Proveedor } from '../../../models/proveedor/proveedor.model';

@Component({
  selector: 'app-proveedor-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './proveedor-create.component.html',
  styleUrl: './proveedor-create.component.scss',
})
export class ProveedorCreateComponent implements OnInit {
  proveedor: Proveedor = {
    nombreCompleto: '',
    nitCi: '',
    telefono: '',
    correo: '',
    direccion: '',
    ciudad: '',
    pais: '',
    empresa: '',
    tipoProveedor: 'MATERIAL',
    estado: 'Activo',
  };

  estados: string[] = ['Activo', 'Inactivo'];

  tiposProveedor: string[] = ['MATERIAL', 'EQUIPO', 'SERVICIO', 'OTROS'];

  constructor(
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  crearProveedor(): void {
    const proveedorSinId = { ...this.proveedor };
    delete proveedorSinId.id;

    console.log('Enviando proveedor:', proveedorSinId);

    this.proveedorService.crearProveedor(proveedorSinId).subscribe({
      next: () => {
        this.router.navigate(['/proveedor']);
      },
      error: (err) => {
        console.error('Error al guardar proveedor:', err);
        if (
          err.status === 400 &&
          err.error === 'Ya existe un proveedor con ese NIT/CI.'
        ) {
          alert('⚠️ Ya existe un proveedor con ese NIT/CI.');
        } else {
          alert('❌ Error inesperado al guardar el proveedor.');
        }
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/proveedor']);
  }
}
