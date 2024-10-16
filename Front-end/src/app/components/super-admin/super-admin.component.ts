import { Component } from '@angular/core';
import { UserService } from '../../services/user.service'; 

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent {
  userIds: string[] = [];
  selectedUserId: string = ''; // Bind this to the input field
  errorMessage: string = ''; 
  successMessage: string = ''; 

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserIds();
  }

  loadUserIds() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.userIds = users.map(user => user._id); // Extract User IDs
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  promoteUser(userId: string, role: string) {
    this.userService.promoteUser(userId, role).subscribe({
      next: (response) => {
        console.log('User promotion success', response);
        this.errorMessage = ''; 
        this.successMessage = `User with ID ${userId} promoted to ${role} successfully!`;
      },
      error: (err) => {
        console.error('User promotion error', err);
        this.successMessage = '';  
        this.errorMessage = 'Failed to promote user. Please try again.';
      }
    });
  }

  removeUser(userId: string) {
    this.userService.removeUser(userId).subscribe({
      next: (response) => {
        console.log('User removal success', response);
        this.errorMessage = ''; 
        this.successMessage = `User with ID ${userId} removed successfully!`;
      },
      error: (err) => {
        console.error('User removal error', err);
        this.successMessage = '';  
        this.errorMessage = 'Failed to remove user. Please try again.';
      }
    });
  }
}
