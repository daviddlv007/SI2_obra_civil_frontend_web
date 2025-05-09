import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {}

  // Login: solo almacena el token
  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { correo, contrasena }).pipe(
      tap((response: any) => {
        this.setToken(response.token); // Solo guarda el token
      })
    );
  }

  // Logout: borra los datos de autenticación y redirige al login
  logout(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    return this.http.post(`${environment.apiUrl}/auth/logout`, null, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(() => {
        this.clearAuthData();
        this.router.navigate(['/login']);
      })
    );
  }

  // Verifica si el usuario está autenticado comprobando la existencia del token
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Obtiene el token almacenado en el localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Guarda el token en el localStorage
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Elimina los datos de autenticación almacenados
  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
