import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }



  login() {
    this.authService.login(this.username, this.password).subscribe(
      (res: any) => {
        this.authService.setToken(res.token);
        this.router.navigate(['/chat']);  
      },
      (err) => {
        this.errorMessage = err.error.message || 'Invalid credentials. Please try again.';  // Display backend error message
      }
    );}
}
