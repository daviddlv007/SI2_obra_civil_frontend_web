import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupService } from '../../../services/backup/backup.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backup.component.html',
  styleUrl: './backup.component.scss',
  providers: [DatePipe],
})
export class BackupComponent {
  backups: any[] = []; // Para almacenar los backups de la base de datos

  isBackupInProgress: boolean = false; // Para mostrar el estado de progreso
  isRestoreSectionVisible: boolean = true; // Controlar visibilidad de la sección de restauración

  constructor(
    private backupService: BackupService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // Obtener la lista de backups cuando se carga el componente
    this.backupService.getBackups().subscribe(
      (response) => {
        // Convertir la fecha a un formato legible antes de asignar a la variable backups
        this.backups = response.map((backup: any) => {
          backup.fechahora = this.datePipe.transform(
            backup.fechahora,
            'dd-MM-yyyy HH:mm:ss'
          );
          return backup;
        });
        console.log('Backups obtenidos:', this.backups);
      },
      (error) => {
        console.error('Error al obtener los backups:', error);
        alert('Hubo un error al obtener los backups');
      }
    );
  }

  //MYSQL
  // Realizar backup de MySQL
  backupMySQL() {
    this.backupService.backupDatabaseMySQL().subscribe(
      (response) => {
        console.log('Backup MySQL iniciado:', response);
        alert('Backup MySQL iniciado correctamente');
      },
      (error) => {
        console.error('Error al realizar el backup de MySQL:', error);
        alert('Hubo un error al iniciar el backup de MySQL');
      }
    );
  }

  // Restaurar base de datos MySQL
  restoreMySQL(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);

      this.backupService.restoreDatabaseMySQL(formData).subscribe(
        (response) => {
          console.log('Restauración MySQL iniciada:', response);
          alert('Restauración MySQL iniciada correctamente');
        },
        (error) => {
          console.error('Error al restaurar la base de datos MySQL:', error);
          alert('Hubo un error al restaurar la base de datos MySQL');
        }
      );
    }
  }

  //POSTGRESQL
  // Realizar backup de PostgreSQL
  backupPostgreSQL() {
    this.backupService.backupDatabasePostgreSQL().subscribe(
      (response) => {
        console.log('Backup PostgreSQL iniciado:', response);
        alert('Backup PostgreSQL iniciado correctamente');
      },
      (error) => {
        console.error('Error al realizar el backup de PostgreSQL:', error);
        alert('Hubo un error al iniciar el backup de PostgreSQL');
      }
    );
  }

  // Restaurar base de datos PostgreSQL
  restorePostgreSQL(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);

      this.backupService.restoreDatabasePostgreSQL(formData).subscribe(
        (response) => {
          console.log('Restauración PostgreSQL iniciada:', response);
          alert('Restauración PostgreSQL iniciada correctamente');
        },
        (error) => {
          console.error(
            'Error al restaurar la base de datos PostgreSQL:',
            error
          );
          alert('Hubo un error al restaurar la base de datos PostgreSQL');
        }
      );
    }
  }

  //H2
  // Realizar backup de H2
  backupHDos() {
    this.backupService.backupDatabase().subscribe(
      (response) => {
        console.log('Backup H2 iniciado:', response);
        alert('Backup H2 iniciado correctamente');
      },
      (error) => {
        // Mostrar detalles más completos sobre el error
        console.error('Error al realizar el backup de H2:', error);
        console.error('Error status:', error.status); // Ver el código de estado
        console.error('Error message:', error.message); // Ver el mensaje del error
        console.error('Error body:', error.error); // Ver el cuerpo de la respuesta del error

        if (error.status === 500) {
          alert('Hubo un error en el servidor al intentar realizar el backup.');
        } else if (error.status === 0) {
          alert('No se pudo conectar al servidor.');
        } else {
          alert('Hubo un error al iniciar el backup de H2: ' + error.message);
        }
      }
    );
  }

  // Restaurar base de datos
  restoreHDos(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);

      this.backupService.restoreDatabase(formData).subscribe(
        (response) => {
          console.log('Restauración H2 iniciada:', response);
          alert('Restauración H2 iniciada correctamente');
        },
        (error) => {
          console.error('Error al restaurar la base de datos H2:', error);
          alert('Hubo un error al restaurar la base de datos H2');
        }
      );
    }
  }

  // Método para descargar un archivo de backup
  downloadBackup(backupFilePath: string): void {
    this.backupService.downloadBackup(backupFilePath).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = backupFilePath.split('/').pop() || 'backup.zip'; // Nombre del archivo
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al descargar el backup:', error);
        alert('Hubo un error al descargar el backup');
      }
    );
  }
}
