import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  role: string = 'user';
  constructor(private http: HttpClient, private router: Router) {}


  register() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role 
    };
  
    this.http.post('http://localhost:5000/api/users/register', user).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
        console.error('Error during registration:', error);
      }
    );
  }
}
