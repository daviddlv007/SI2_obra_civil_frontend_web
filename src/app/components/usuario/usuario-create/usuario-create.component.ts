import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { RolService } from '../../../services/rol/rol.service';
import { Usuario } from '../../../models/usuario/usuario.model';
import { Rol } from '../../../models/rol/rol.model';

@Component({
  selector: 'app-usuario-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuario-create.component.html',
  styleUrl: './usuario-create.component.scss'
})
export class UsuarioCreateComponent implements OnInit {
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
    rol: { id: 0, nombre: '', descripcion: '' }
  };

  roles: Rol[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.rolService.obtenerRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  crearUsuario(): void {
    this.usuarioService.crearUsuario(this.usuario).subscribe(() => {
      this.router.navigate(['/usuario']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/usuario']);
  }
}
