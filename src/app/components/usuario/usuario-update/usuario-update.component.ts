import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario/usuario.service'; // Importamos el servicio de Usuario
import { RolService } from '../../../services/rol/rol.service'; // Importamos el servicio de Roles (si es necesario)
import { Usuario } from '../../../models/usuario/usuario.model'; // Importamos el modelo de Usuario
import { Rol } from '../../../models/rol/rol.model'; // Importamos el modelo de Rol (si es necesario)

@Component({
  selector: 'app-usuario-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuario-update.component.html',
  styleUrls: ['./usuario-update.component.scss']
})
export class UsuarioUpdateComponent implements OnInit {
  usuario: Usuario = {
    id: 0,
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
  roles: Rol[] = []; // Lista de roles (si es necesario)

  constructor(
    private usuarioService: UsuarioService, // Servicio de Usuario
    private rolService: RolService, // Servicio de Rol (si es necesario)
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario desde la URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      // Obtener el usuario por ID
      this.usuarioService.obtenerUsuarioPorId(id).subscribe((data) => {
        this.usuario = data; // Asignamos los datos del usuario obtenido
      });
    }

    // Obtener los roles disponibles (si es necesario)
    this.rolService.obtenerRoles().subscribe((data) => {
      this.roles = data; // Asignamos los roles disponibles
    });
  }

  actualizarUsuario(): void {
    if (this.usuario.id) {
      // Si el usuario tiene un ID, lo actualizamos
      this.usuarioService.actualizarUsuario(this.usuario.id, this.usuario).subscribe(() => {
        this.router.navigate(['/usuario']); // Redirige a la lista de usuarios
      });
    }
  }

  cancelar(): void {
    // Si se cancela, redirigimos a la lista de usuarios
    this.router.navigate(['/usuario']);
  }
}
