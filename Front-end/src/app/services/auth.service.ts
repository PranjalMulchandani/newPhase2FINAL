import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users'; 
  private tokenKey = 'auth-token';

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
  decodeToken(token: string) {
    return jwtDecode(token);
  }


  getRoles(): string[] {
    const token = this.getToken();
    if (token) {
      const decoded: any = this.decodeToken(token);
      return decoded.roles;
    }
    return [];
  }

  isSuperAdmin(): boolean {
    return this.getRoles().includes('super-admin');
  }

  isGroupAdmin(): boolean {
    return this.getRoles().includes('admin');
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
}