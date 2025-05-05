import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //MYQSL
  // Método para realizar el backup de MySQL
  backupDatabaseMySQL(): Observable<any> {
    return this.http.post(`${this.apiUrl}/backup/database/mysql`, {});
  }

  // Método para restaurar la base de datos de MySQL
  restoreDatabaseMySQL(file: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/backup/restore/mysql`, file);
  }

  //POSTGRESQL
  // Método para realizar el backup de PostgreSQL
  backupDatabasePostgreSQL(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/backup/database/postgresql`,
      {},
      { responseType: 'text' }
    );
  }

  // Método para restaurar la base de datos de PostgreSQL
  restoreDatabasePostgreSQL(file: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/backup/restore/postgresql`, file);
  }

  //H2
  // Método para realizar el backup de H2
  backupDatabase(): Observable<any> {
    return this.http.post(`${this.apiUrl}/backup/database/h2`, {});
  }

  // Método para restaurar la base de datos de H2
  restoreDatabase(file: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/backup/restore/h2`, file);
  }

  // Obtener la lista de backups
  getBackups(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backup/list`);
  }

  // Descargar un archivo de backup
  downloadBackup(backupFilePath: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/backup/download?backupFilePath=${encodeURIComponent(
        backupFilePath
      )}`,
      {
        responseType: 'blob', // Para descargar el archivo
      }
    );
  }
}
