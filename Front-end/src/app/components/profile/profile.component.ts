import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  selectedFile: File | null = null;
  avatarUrl: string = '';

  constructor(private http: HttpClient, private authService: AuthService) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }



 uploadAvatar() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('avatar', this.selectedFile);

    
    const token = this.authService.getToken(); 
    if (token) {
        const decoded: any = this.authService.decodeToken(token);
        if (decoded && decoded.id) {
            formData.append('userId', decoded.id); 
        } else {
            console.error('User ID is not available in the token');
            return; 
        }
    } else {
        console.error('No token found, user is not authenticated');
        return; 
    }

    this.http.post('http://localhost:5000/api/users/upload-avatar', formData)
      .subscribe((response: any) => {
        
        this.avatarUrl = `http://localhost:5000/${response.user.avatar}`; 
        console.log('Avatar URL:', this.avatarUrl); 
      }, (error) => {
        console.error('Error uploading avatar:', error);
      });
}



}
