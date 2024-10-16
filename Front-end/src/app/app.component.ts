import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.getToken();
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  isGroupAdmin(): boolean {
    return this.authService.isGroupAdmin();
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
