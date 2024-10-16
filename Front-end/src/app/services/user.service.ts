import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users'; 

  constructor(private http: HttpClient) {}
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  // API call to promote a user
  promoteUser(userId: string, role: string): Observable<any> {
    const url = `${this.apiUrl}/promoteUser`; // Ensure the endpoint matches the backend
    return this.http.post(url, { userId, role });
  }
  removeUser(userId: string): Observable<any> {
    const url = `${this.apiUrl}/removeUser/${userId}`; // Ensure the endpoint matches the backend
    return this.http.delete(url);
  }
}
