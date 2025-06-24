import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TareaService } from '../../../services/tarea/tarea.service';
import { ObracivilService } from '../../../services/obracivil/obracivil.service';
import { Tarea } from '../../../models/tarea/tarea.model';
import { Obracivil } from '../../../models/obracivil/obracivil.model';
import { Router } from '@angular/router';
import { ServicioTarea } from '../../../models/servicio-tarea/servicio-tarea.model';
import { ServicioTareaService } from '../../../services/servicio-tarea/servicio-tarea.service';
import { Servicio } from '../../../models/servicio-tarea/servicio-tarea.model';
import { ServicioService } from '../../../services/servicio/servicio.service';
import { FilterService } from '../../../services/filter/filter.service';
import { Empleado } from '../../../models/empleado/empleado.model';
import { EmpleadoTarea } from '../../../models/empleado-tarea/empleado-tarea.model';
import { EmpleadoService } from '../../../services/empleado/empleado.service';
import { EmpleadoTareaService } from '../../../services/empleado-tarea/empleado-tarea.service';
import { Equipo } from '../../../models/equipo/equipo.model';
import { EquipoTarea } from '../../../models/equipo-tarea/equipo-tarea.model';
import { EquipoService } from '../../../services/equipo/equipo.service';
import { EquipoTareaService } from '../../../services/equipo-tarea/equipo-tarea.service';
import { Material } from '../../../models/material/material.model';
import { MaterialTarea } from '../../../models/material-tarea/material-tarea.model';
import { MaterialService } from '../../../services/material/material.service';
import { MaterialTareaService } from '../../../services/material-tarea/material-tarea.service';


@Component({
  selector: 'app-tarea-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tarea-create.component.html',
  styleUrls: ['./tarea-create.component.scss']
})
export class TareaCreateComponent implements OnInit {
  tarea: Tarea = {
    nombre: '',
    descripcion: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    estado: 'pendiente',
    prioridad: 'media',
    obraCivil: { id: 0, nombre: '' }
  };

  obrasCiviles: Obracivil[] = [];
  estados = ['pendiente', 'en progreso', 'completada', 'cancelada'];
  prioridades = ['baja', 'media', 'alta'];

  servicios: Servicio[] = [];
  selectedServicios: ServicioTarea[] = [];
  filtroServicio: string = '';
  mostrarSugerencias: boolean = false;

  empleados: Empleado[] = [];
  selectedEmpleados: Empleado[] = [];
  filtroEmpleado: string = '';
  mostrarSugerenciasEmpleado: boolean = false;

  equipos: Equipo[] = [];
  selectedEquipos: EquipoTarea[] = [];
  filtroEquipo: string = '';
  mostrarSugerenciasEquipo: boolean = false;

  materiales: Material[] = [];
  selectedMateriales: { material: Material; cantidad: number }[] = [];
  filtroMaterial: string = '';
  mostrarSugerenciasMaterial: boolean = false;


  constructor(
    private tareaService: TareaService,
    private obraCivilService: ObracivilService,
    private servicioService: ServicioService,
    private servicioTareaService: ServicioTareaService,
    private empleadoService: EmpleadoService,
    private empleadoTareaService: EmpleadoTareaService,
    private equipoService: EquipoService,
    private equipoTareaService: EquipoTareaService,
    private filterService: FilterService,
    private materialService: MaterialService,
    private materialTareaService: MaterialTareaService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.cargarObrasCiviles();
    this.cargarServicios();
    this.cargarEmpleados();
    this.cargarEquipos();
    this.cargarMateriales();

  }

  cargarObrasCiviles(): void {
    this.obraCivilService.obtenerObras().subscribe(obras => {
      this.obrasCiviles = obras;
    });
  }

  cargarServicios(): void {
    this.servicioService.obtenerServicios().subscribe(servicios => {
      this.servicios = servicios;
    });
  }

  get serviciosFiltrados(): Servicio[] {
    const filtrados = this.filterService.filtrar(this.servicios, this.filtroServicio);
    return filtrados;
  }


  seleccionarServicio(servicio: Servicio): void {
  const yaSeleccionado = this.selectedServicios.some(
    s => s.servicioId === servicio.id
  );

  if (!yaSeleccionado) {
    this.selectedServicios.push({
      servicioId: servicio.id,
      servicio: servicio,
      cantidad: 0,
      precioUnitario: servicio.precioUnitario || 0,
      subtotal: 0
    });
  }

  this.filtroServicio = '';
  this.mostrarSugerencias = false;
}



    removeServicioFromSelected(servicio: Servicio): void {
      this.selectedServicios = this.selectedServicios.filter(s => s.id !== servicio.id);
    }

    ocultarSugerenciasConDelay(): void {
      setTimeout(() => {
        this.mostrarSugerencias = false;
      }, 200); // Permitir el click antes de ocultar
    }

    cargarEmpleados(): void {
      this.empleadoService.obtenerEmpleados().subscribe(empleados => {
        this.empleados = empleados;
      });
    }

    get empleadosFiltrados(): Empleado[] {
    return this.filterService.filtrar(this.empleados, this.filtroEmpleado);
  }

    seleccionarEmpleado(empleado: Empleado): void {
      if (!this.selectedEmpleados.some(e => e.id === empleado.id)) {
        this.selectedEmpleados.push(empleado);
      }
      this.filtroEmpleado = '';
      this.mostrarSugerenciasEmpleado = false;
    }

    removeEmpleadoFromSelected(empleado: Empleado): void {
      this.selectedEmpleados = this.selectedEmpleados.filter(e => e.id !== empleado.id);
    }

    ocultarSugerenciasEmpleadoConDelay(): void {
      setTimeout(() => {
        this.mostrarSugerenciasEmpleado = false;
      }, 200);
    }


    cargarEquipos(): void {
    this.equipoService.obtenerEquipos().subscribe(equipos => {
      this.equipos = equipos;
    });
  }

  get equiposFiltrados(): Equipo[] {
    return this.filterService.filtrar(this.equipos, this.filtroEquipo);
  }

seleccionarEquipo(equipo: Equipo): void {
  const yaSeleccionado = this.selectedEquipos.some(
    e => e.equipo?.id === equipo.id
  );

  if (!yaSeleccionado) {
    this.selectedEquipos.push({
      equipo: equipo,
      cantidad: 1,
      precioUnitario: equipo.precioUnitario || 0,
      subtotal: 0
    });
  }

  this.filtroEquipo = '';
  this.mostrarSugerenciasEquipo = false;
}

removeEquipoFromSelected(equipo?: Equipo): void {
  if (!equipo) {
    return; // No hacer nada si es undefined
  }
  this.selectedEquipos = this.selectedEquipos.filter(e => e.equipo?.id !== equipo.id);
}



  ocultarSugerenciasEquipoConDelay(): void {
    setTimeout(() => {
      this.mostrarSugerenciasEquipo = false;
    }, 200);
  }

  cargarMateriales(): void {
    this.materialService.obtenerMateriales().subscribe(materiales => {
      this.materiales = materiales;
    });
  }

  get materialesFiltrados(): Material[] {
    return this.filterService.filtrar(this.materiales, this.filtroMaterial);
  }

  seleccionarMaterial(material: Material): void {
    const yaSeleccionado = this.selectedMateriales.find(m => m.material.id === material.id);
    if (!yaSeleccionado) {
      this.selectedMateriales.push({ material, cantidad: 1 });
    }
    this.filtroMaterial = '';
    this.mostrarSugerenciasMaterial = false;
  }

removeMaterialFromSelected(material?: Material): void {
  if (!material) {
    return; // No hacer nada si es undefined
  }
  this.selectedMateriales = this.selectedMateriales.filter(m => m.material.id !== material.id);
}


  ocultarSugerenciasMaterialConDelay(): void {
    setTimeout(() => {
      this.mostrarSugerenciasMaterial = false;
    }, 200);
  }

    calcularSubtotalS(servicioTarea: ServicioTarea): void {
    const cantidad = servicioTarea.cantidad || 0;
    const precio = servicioTarea.precioUnitario || 0;
    servicioTarea.subtotal = cantidad * precio;
  }

  calcularSubtotalE(equipoTarea: EquipoTarea): void {
  const cantidad = equipoTarea.cantidad || 0;
  const precio = equipoTarea.precioUnitario || 0;
  equipoTarea.subtotal = cantidad * precio;
}

calcularSubtotalM(materialTarea: { material: Material; cantidad: number; subtotal?: number }): void {
  const cantidad = materialTarea.cantidad || 0;
  const precio = materialTarea.material?.precioUnitario || 0;
  materialTarea.subtotal = cantidad * precio;
}

crearTarea(): void {
  // 1. Validar fechas
  if (new Date(this.tarea.fechaFin) < new Date(this.tarea.fechaInicio)) {
    alert('La fecha de fin no puede ser anterior a la fecha de inicio');
    return;
  }

  // 2. Crear la tarea principal
  this.tareaService.crearTarea(this.tarea).pipe(
    switchMap((nuevaTarea) => {
      const llamadas: any[] = [];

      // 3. ServicioTarea: para cada servicio seleccionado
        this.selectedServicios.forEach((servicioTarea) => {
          const tareaServicio: ServicioTarea = {
            tarea: { id: nuevaTarea.id },
            servicio: { id: servicioTarea.servicio?.id },
            cantidad: servicioTarea.cantidad,
            precioUnitario: servicioTarea.precioUnitario,
            subtotal: servicioTarea.subtotal
          };

        llamadas.push(
          this.servicioTareaService.crearServicioTarea(tareaServicio).pipe(
            catchError(err => {
              console.error('Error al crear ServicioTarea para servicio id', servicioTarea.servicio?.id, err);
              return of(null);
            })
          )
        );
      });

// 4. EmpleadoTarea: para cada empleado seleccionado
this.selectedEmpleados.forEach((empleadoTarea) => {
  const tareaEmpleado: EmpleadoTarea = {
    tarea: { id: nuevaTarea.id },
    empleado: { id: empleadoTarea.id },
    horasTrabajadas: 1,
    fechaAsignacion: new Date().toISOString().split('T')[0],
    rolEnTarea: 'trabajador'
  };

  llamadas.push(
    this.empleadoTareaService.crearEmpleadoTarea(tareaEmpleado).pipe(
      catchError(err => {
        console.error('Error al crear EmpleadoTarea para empleado id', empleadoTarea.id, err);
        return of(null);
      })
    )
  );
});


// 5. EquipoTarea: para cada equipo seleccionado
this.selectedEquipos.forEach((equipoTarea) => {
  const tareaEquipo: EquipoTarea = {
  tarea: { id: nuevaTarea.id },
  equipo: { id: equipoTarea.equipo?.id },
  cantidad: equipoTarea.cantidad,       // <- agregar este campo
  precioUnitario: equipoTarea.precioUnitario,
  subtotal: equipoTarea.subtotal
};


  llamadas.push(
    this.equipoTareaService.crearEquipoTarea(tareaEquipo).pipe(
      catchError(err => {
        console.error('Error al crear EquipoTarea para equipo id', equipoTarea.equipo?.id, err);
        return of(null);
      })
    )
  );
});



      // 6. MaterialTarea: si tu DTO requiere cantidad, inclúyela
this.selectedMateriales.forEach(({ material, cantidad }) => {
  const cantidadParaEnvio = cantidad ?? 1;
  const precioUnitarioParaEnvio = material.precioUnitario ?? 0;
  const subtotalParaEnvio = cantidadParaEnvio * precioUnitarioParaEnvio;

  const tareaMaterial: MaterialTarea = {
    tarea: { id: nuevaTarea.id },
    material: material,
    cantidad: cantidadParaEnvio,
    precioUnitario: precioUnitarioParaEnvio,
    subtotal: subtotalParaEnvio
  };

  llamadas.push(
    this.materialTareaService.crearMaterialTarea(tareaMaterial).pipe(
      catchError(err => {
        console.error('Error al crear MaterialTarea para material id', material.id, err);
        return of(null);
      })
    )
  );
});


      // 7. Ejecutar todas las llamadas en paralelo
      return llamadas.length ? forkJoin(llamadas) : of([]);
    }),
    catchError(err => {
      console.error('Error creando tarea principal', err);
      alert('Ocurrió un error al crear la tarea. Revisa consola.');
      return of(null);
    })
  ).subscribe({
    next: () => {
      // Navegar sólo cuando todas las inserciones hayan finalizado
      this.router.navigate(['/tarea']);
    },
    error: (err) => {
      console.error('Error inesperado en la cadena', err);
      alert('Error inesperado. Ver consola.');
    }
  });
}



  cancelar(): void {
    this.router.navigate(['/tarea']);
  }
}
