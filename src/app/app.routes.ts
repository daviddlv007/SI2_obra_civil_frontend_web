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
import { AuthGuard } from './guards/auth/auth.guard';
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

import { MaterialComponent } from './components/material/material.component';
import { MaterialCreateComponent } from './components/material/material-create/material-create.component';
import { MaterialUpdateComponent } from './components/material/material-update/material-update.component';

import { EquipoComponent } from './components/equipo/equipo.component';
import { EquipoCreateComponent } from './components/equipo/equipo-create/equipo-create.component';
import { EquipoUpdateComponent } from './components/equipo/equipo-update/equipo-update.component';

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

//COMPRAS
import { CompraListComponent } from './components/compra/compra-list/compra-list.component';
import { CompraCreateComponent } from './components/compra/compra-create/compra-create.component';

import { CompraMaterialCreateComponent } from './components/compra/compra-material-create/compra-material-create.component';
import { CompraEquipoCreateComponent } from './components/compra/compra-equipo-create/compra-equipo-create.component';
import { CompraServicioCreateComponent } from './components/compra/compra-servicio-create/compra-servicio-create.component';

import { CompraUpdateComponent } from './components/compra/compra-update/compra-update.component';
import { CompraShowComponent } from './components/compra/compra-show/compra-show.component';

//Dashboard
import { DashboardComponent } from './components/home/dashboard/dashboard.component';

import { ObraCivilGanttComponent } from './components/obra-civil-gantt/obra-civil-gantt.component';

import { ObraCivilTareaReporteComponent } from './components/obra-civil-tarea-reporte/obra-civil-tarea-reporte.component';

import { ProveedorComponent } from './components/proveedor/proveedor.component';
import { ProveedorCreateComponent } from './components/proveedor/proveedor-create/proveedor-create.component';
import { ProveedorUpdateComponent } from './components/proveedor/proveedor-update/proveedor-update.component';
import { CompraReportesComponent } from './components/compra/compra-reportes/compra-reportes.component';

import { EstimacionComponent } from './components/estimacion/estimacion.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
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

      //COMPRAS
      { path: 'compra', component: CompraListComponent },
      { path: 'compra-create', component: CompraCreateComponent },
      { path: 'compra-update/:id', component: CompraUpdateComponent },
      { path: 'compra-detalle/:id/:tipo', component: CompraShowComponent },

      {
        path: 'compra-material-create',
        component: CompraMaterialCreateComponent,
      },
      { path: 'compra-equipo-create', component: CompraEquipoCreateComponent },
      {
        path: 'compra-servicio-create',
        component: CompraServicioCreateComponent,
      },
      //reporte de compra
      { path: 'compra-reportes', component: CompraReportesComponent },

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

      { path: '', redirectTo: 'usuario', pathMatch: 'full' },

      { path: 'material', component: MaterialComponent },
      { path: 'material-create', component: MaterialCreateComponent },
      { path: 'material-update/:id', component: MaterialUpdateComponent },

      { path: 'equipo', component: EquipoComponent },
      { path: 'equipo-create', component: EquipoCreateComponent },
      { path: 'equipo-update/:id', component: EquipoUpdateComponent },

      // PROYECTO - OBRA CIVIL
      { path: 'obra-civil', component: ObracivilListComponent },
      { path: 'obra-civil-create', component: ObracivilCreateComponent },
      { path: 'obra-civil-update/:id', component: ObracivilUpdateComponent },
      { path: 'obra-civil-show/:id', component: ObracivilShowComponent },

      // SERVICIO
      { path: 'servicio', component: ServicioComponent },
      { path: 'servicio-create', component: ServicioCreateComponent },
      { path: 'servicio-update/:id', component: ServicioUpdateComponent },

      //EMPLEADO
      { path: 'empleado', component: EmpleadoComponent },
      { path: 'empleado-create', component: EmpleadoCreateComponent },
      { path: 'empleado-update/:id', component: EmpleadoUpdateComponent },

      { path: 'proveedor', component: ProveedorComponent },
      { path: 'proveedor-create', component: ProveedorCreateComponent },
      { path: 'proveedor-update/:id', component: ProveedorUpdateComponent },

      //Dashboard
      { path: 'dashboard', component: DashboardComponent },

      { path: 'obra-civil-gantt/:id', component: ObraCivilGanttComponent },
      {
        path: 'obra-civil-tarea-reporte/:id_obra',
        component: ObraCivilTareaReporteComponent,
      },

      { path: 'estimacion', component: EstimacionComponent },


      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'dashboard' },
];
