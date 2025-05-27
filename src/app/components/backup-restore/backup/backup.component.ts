import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupService } from '../../../services/backup/backup.service';
import { DatePipe } from '@angular/common';

declare var bootstrap: any; // Bootstrap 5 JS (para usar modals)

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

  driveBackups: any[] = [];

  selectedFile: File | null = null;

  isBackupInProgress: boolean = false; // Para mostrar el estado de progreso
  isRestoreSectionVisible: boolean = true; // Controlar visibilidad de la sección de restauración

  selectedFileId: string = '';
  selectedFileName: string = '';

  modalMessage: string = '';

  constructor(
    private backupService: BackupService,
    private datePipe: DatePipe
  ) {}

  /*ngOnInit(): void {
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
  }*/

  ngOnInit(): void {
    //this.getBackups();
    this.getDriveBackups();
  }

  // Obtener la lista de backups cuando se carga el componente
  getBackups(): void {
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
        //alert('Error al obtener backups desde Google Drive');
        this.showMessage('Error al obtener backups desde Google Drive');
      }
    );
  }

  //H2
  // Realizar backup de H2
  backupHDos() {
    this.backupService.backupDatabase().subscribe(
      (response) => {
        console.log('Backup H2 iniciado:', response);
        //alert('Backup H2 iniciado correctamente');
        this.showMessage('Backup H2 iniciado correctamente');
      },
      (error) => {
        // Mostrar detalles más completos sobre el error
        console.error('Error al realizar el backup de H2:', error);
        //console.error('Error status:', error.status); // Ver el código de estado
        //console.error('Error message:', error.message); // Ver el mensaje del error
        //console.error('Error body:', error.error); // Ver el cuerpo de la respuesta del error

        if (error.status === 500) {
          //alert('Hubo un error en el servidor al intentar realizar el backup.');
          this.showMessage(
            'Hubo un error en el servidor al intentar realizar el backup.'
          );
        } else if (error.status === 0) {
          //alert('No se pudo conectar al servidor.');
          this.showMessage('No se pudo conectar al servidor.');
        } else {
          //alert('Hubo un error al iniciar el backup de H2: ' + error.message);
          this.showMessage(
            'Hubo un error al iniciar el backup de H2: ' + error.message
          );
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
          //alert('Restauración H2 iniciada correctamente');
          this.showMessage('Restauración H2 iniciada correctamente');
        },
        (error) => {
          console.error('Error al restaurar la base de datos H2:', error);
          //alert('Hubo un error al restaurar la base de datos H2');
          this.showMessage('Hubo un error al restaurar la base de datos H2');
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
        //alert('Hubo un error al descargar el backup');
        this.showMessage('Hubo un error al descargar el backup');
      }
    );
  }

  //Google Driver
  getDriveBackups(): void {
    this.backupService.getBackupsGD().subscribe(
      (response) => {
        // Convertir la fecha a un formato legible antes de asignar a la variable backups
        this.driveBackups = response.map((backup: any) => {
          backup.createdTime = this.datePipe.transform(
            backup.createdTime,
            'dd-MM-yyyy HH:mm:ss'
          );
          return backup;
        });
        console.log('Backups obtenidos:', this.driveBackups);
      },
      (error) => {
        console.error('Error al obtener los backups:', error);
        //alert('Error al obtener backups desde Google Drive');
        this.showMessage('Error al obtener backups desde Google Drive');
      }
    );
  }

  createBackupToDrive(): void {
    this.isBackupInProgress = true;
    this.backupService.backupToGoogleDrive().subscribe(
      (res) => {
        //alert('Backup en Google Drive creado correctamente');
        this.showMessage('Backup en Google Drive creado correctamente');
        this.getDriveBackups();
        this.isBackupInProgress = false;
      },
      (err) => {
        //alert('Error al crear backup en Google Drive');
        this.showMessage('Error al crear backup en Google Drive');
        console.error(err);
        this.isBackupInProgress = false;
      }
    );
  }

  downloadFromDrive(fileId: string, fileName: string): void {
    this.backupService.downloadDriveBackup(fileId).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al descargar backup de Drive:', error);
        //alert('Error al descargar backup desde Google Drive');
        this.showMessage('Error al descargar backup desde Google Drive');
      }
    );
  }

  restoreFromDrive(fileId: string): void {
    if (
      confirm(
        '¿Está seguro que desea restaurar este backup? Se sobrescribirá la base de datos actual.'
      )
    ) {
      this.backupService.restoreFromDrive(fileId).subscribe(
        () => {
          //alert('Backup restaurado correctamente.');
          this.showMessage('Backup restaurado correctamente.');
        },
        (error) => {
          console.error('Error al restaurar backup:', error);
          //alert('Error al restaurar backup desde Google Drive');
          this.showMessage('Error al restaurar backup desde Google Drive');
        }
      );
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadAndRestore(): void {
    if (!this.selectedFile) {
      //alert('Por favor, seleccione un archivo de backup .zip');
      this.showMessage('Por favor, seleccione un archivo de backup .zip');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.backupService.restoreFromLocal(formData).subscribe(
      () => {
        //alert('Backup restaurado desde archivo local correctamente');
        this.showMessage('Backup restaurado desde archivo local correctamente');
      },
      (error) => {
        console.error('Error al restaurar backup local:', error);
        //alert('Error al restaurar desde archivo local');
        this.showMessage('Error al restaurar desde archivo local');
      }
    );
  }

  openRestoreModal(fileId: string, fileName: string): void {
    this.selectedFileId = fileId;
    this.selectedFileName = fileName;

    const modalElement = document.getElementById('restoreConfirmModal');
    if (modalElement) {
      const restoreModal = new bootstrap.Modal(modalElement);
      restoreModal.show();
    }
  }

  confirmRestore(): void {
    const modalElement = document.getElementById('restoreConfirmModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide(); // Cierra el modal
    }

    this.backupService.restoreFromDrive(this.selectedFileId).subscribe(
      (res) => {
        alert('Restauración completada con éxito.');
        this.showMessage('Restauración completada con éxito.');
      },
      (err) => {
        console.error('Error al restaurar:', err);
        //alert('Hubo un error al intentar restaurar la base de datos.');
        this.showMessage(
          'Hubo un error al intentar restaurar la base de datos.'
        );
      }
    );
  }

  showMessage(message: string): void {
    this.modalMessage = message;

    const modalElement = document.getElementById('messageModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
