import { Routes } from '@angular/router';
import { PersonaComponent } from './components/persona/persona.component';
import { PersonaCreateComponent } from './components/persona/persona-create/persona-create.component';
import { PersonaUpdateComponent } from './components/persona/persona-update/persona-update.component';
import { AutoComponent } from './components/auto/auto.component';
import { AutoCreateComponent } from './components/auto/auto-create/auto-create.component';
import { AutoUpdateComponent } from './components/auto/auto-update/auto-update.component';
import { PerroComponent } from './components/perro/perro.component';
import { PerroCreateComponent } from './components/perro/perro-create/perro-create.component';
import { PerroUpdateComponent } from './components/perro/perro-update/perro-update.component';
import { LoginComponent } from './components/auth/login/login.component';
//import { AuthGuard } from './guards/auth/auth.guard';descomentar
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';


//USUARIO
//permiso
import { PermisoListComponent } from './components/administrador/permiso/permiso-list/permiso-list.component';
import { PermisoCreateComponent } from './components/administrador/permiso/permiso-create/permiso-create.component';
import { PermisoUpdateComponent } from './components/administrador/permiso/permiso-update/permiso-update.component';

import { RolComponent } from './components/rol/rol.component';
import { RolCreateComponent } from './components/rol/rol-create/rol-create.component';
import { RolUpdateComponent } from './components/rol/rol-update/rol-update.component';

import { UsuarioComponent } from './components/usuario/usuario.component';
import { UsuarioCreateComponent } from './components/usuario/usuario-create/usuario-create.component';
import { UsuarioUpdateComponent } from './components/usuario/usuario-update/usuario-update.component';

import { BitacoraComponent } from './components/bitacora/bitacora.component';
import { TareaComponent } from './components/tarea/tarea.component';
import { TareaCreateComponent } from './components/tarea/tarea-create/tarea-create.component';
import { TareaUpdateComponent } from './components/tarea/tarea-update/tarea-update.component';

import { BackupComponent } from './components/backup-restore/backup/backup.component';

// PROYECTO - OBRA CIVIL
import { ObracivilListComponent } from './components/proyecto/obracivil/obracivil-list/obracivil-list.component';
import { ObracivilCreateComponent } from './components/proyecto/obracivil/obracivil-create/obracivil-create.component';
import { ObracivilUpdateComponent } from './components/proyecto/obracivil/obracivil-update/obracivil-update.component';
import { ObracivilShowComponent } from './components/proyecto/obracivil/obracivil-show/obracivil-show.component';

//SERVICIO
import { ServicioComponent } from './components/servicio/servicio.component';
import { ServicioCreateComponent } from './components/servicio/servicio-create/servicio-create.component';
import { ServicioUpdateComponent } from './components/servicio/servicio-update/servicio-update.component';

//EMPLEADO
import { EmpleadoComponent } from './components/empleado/empleado.component';
import { EmpleadoCreateComponent } from './components/empleado/empleado-create/empleado-create.component';
import { EmpleadoUpdateComponent } from './components/empleado/empleado-update/empleado-update.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    //canActivate: [AuthGuard],descomentar
    children: [
      { path: 'persona', component: PersonaComponent },
      { path: 'persona-create', component: PersonaCreateComponent },
      { path: 'persona-update/:id', component: PersonaUpdateComponent },

      { path: 'auto', component: AutoComponent },
      { path: 'auto-create', component: AutoCreateComponent },
      { path: 'auto-update/:id', component: AutoUpdateComponent },

      { path: 'perro', component: PerroComponent },
      { path: 'perro-create', component: PerroCreateComponent },
      { path: 'perro-update/:id', component: PerroUpdateComponent },

      //USUARIO
      //Backup-Restore
      { path: 'backup-restore', component: BackupComponent },

      //permiso
      { path: 'permiso', component: PermisoListComponent },
      { path: 'permiso-create', component: PermisoCreateComponent },
      { path: 'permiso-update/:id', component: PermisoUpdateComponent },

      { path: 'rol', component: RolComponent },
      { path: 'rol-create', component: RolCreateComponent },
      { path: 'rol-update/:id', component: RolUpdateComponent },

      { path: 'usuario', component: UsuarioComponent },
      { path: 'usuario-create', component: UsuarioCreateComponent },
      { path: 'usuario-update', component: UsuarioUpdateComponent },
      { path: 'usuario-update/:id', component: UsuarioUpdateComponent },
      // BITÁCORA Y TAREA
      { path: 'bitacora', component: BitacoraComponent },
      { path: 'tarea', component: TareaComponent },
      { path: 'tarea-create', component: TareaCreateComponent },
      { path: 'tarea-update/:id', component: TareaUpdateComponent },

      // PROYECTO - OBRA CIVIL
      { path: 'obra-civil', component: ObracivilListComponent },
      { path: 'obra-civil-create', component: ObracivilCreateComponent },
      { path: 'obra-civil-update/:id', component: ObracivilUpdateComponent },
      { path: 'obra-civil-show/:id', component: ObracivilShowComponent },

     // { path: '', redirectTo: 'usuario', pathMatch: 'full' },


       // SERVICIO
       { path: 'servicio', component: ServicioComponent },
       { path: 'servicio-create', component: ServicioCreateComponent },
       { path: 'servicio-update/:id', component: ServicioUpdateComponent },


       //EMPLEADO
       { path: 'empleado', component: EmpleadoComponent },
       { path: 'empleado-create', component: EmpleadoCreateComponent },
       { path: 'empleado-update/:id', component: EmpleadoUpdateComponent },


      // { path: '', redirectTo: 'servicio', pathMatch: 'full' }

    ],

  },

   //{ path: 'login', component: LoginComponent }, descomentar
   //{ path: '**', redirectTo: 'usuario' }, descomentar
   { path: '', redirectTo: 'servicio', pathMatch: 'full' }

];
