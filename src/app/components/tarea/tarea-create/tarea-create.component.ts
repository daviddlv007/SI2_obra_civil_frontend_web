import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
import { EquipoTarea } from '../../../models/equipo-tarea/equipo-tarea.mode';
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
  selectedServicios: Servicio[] = [];
  filtroServicio: string = '';
  mostrarSugerencias: boolean = false;

  empleados: Empleado[] = [];
  selectedEmpleados: Empleado[] = [];
  filtroEmpleado: string = '';
  mostrarSugerenciasEmpleado: boolean = false;

  equipos: Equipo[] = [];
  selectedEquipos: Equipo[] = [];
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
    if (!this.selectedServicios.some(s => s.id === servicio.id)) {
      this.selectedServicios.push(servicio);
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
    if (!this.selectedEquipos.some(e => e.id === equipo.id)) {
      this.selectedEquipos.push(equipo);
    }
    this.filtroEquipo = '';
    this.mostrarSugerenciasEquipo = false;
  }

  removeEquipoFromSelected(equipo: Equipo): void {
    this.selectedEquipos = this.selectedEquipos.filter(e => e.id !== equipo.id);
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

  removeMaterialFromSelected(material: Material): void {
    this.selectedMateriales = this.selectedMateriales.filter(m => m.material.id !== material.id);
  }

  ocultarSugerenciasMaterialConDelay(): void {
    setTimeout(() => {
      this.mostrarSugerenciasMaterial = false;
    }, 200);
  }


    crearTarea(): void {
      if (new Date(this.tarea.fechaFin) < new Date(this.tarea.fechaInicio)) {
        alert('La fecha de fin no puede ser anterior a la fecha de inicio');
        return;
      }

      this.tareaService.crearTarea(this.tarea).subscribe((nuevaTarea) => {
        this.selectedServicios.forEach((servicio) => {
          const tareaServicio: ServicioTarea = {
            tarea: { id: nuevaTarea.id },
            servicio: { id: servicio.id }
          };
          this.servicioTareaService.crearServicioTarea(tareaServicio).subscribe();
        });

        this.selectedEmpleados.forEach((empleado) => {
          const empleadoTarea: EmpleadoTarea = {
            tareaId: nuevaTarea.id,
            empleadoId: empleado.id,
            fechaAsignacion: new Date().toISOString().split('T')[0],
            rolEnTarea: 'trabajador'
          };
          this.empleadoTareaService.crearEmpleadoTarea(empleadoTarea).subscribe();
        });

        this.selectedEquipos.forEach((equipo) => {
           const equipoTarea: EquipoTarea = {
              tareaId: nuevaTarea.id ,
              equipoId: equipo.id,
              fechaAsignacion: new Date().toISOString().split('T')[0]
            };
          this.equipoTareaService.crearEquipoTarea(equipoTarea).subscribe();
        });

        this.selectedMateriales.forEach(({ material, cantidad }) => {
          const materialTarea: MaterialTarea = {
            tareaId: nuevaTarea.id,
            materialId: material.id,
          };
          this.materialTareaService.crearMaterialTarea(materialTarea).subscribe();
        });

        this.router.navigate(['/tarea']);
      });
    }


  cancelar(): void {
    this.router.navigate(['/tarea']);
  }
}
