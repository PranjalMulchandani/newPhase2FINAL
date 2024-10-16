import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service'; // Ensure the correct path to your service
import { Socket } from 'ngx-socket-io'; // Socket.IO
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css'],
})
export class GroupManagementComponent implements OnInit {
  groupName: string = '';
  channelName: string = '';
  selectedGroupId: string = ''; 
  groups: any[] = []; 
  successMessage: string = '';  // New field for success message
  errorMessage: string = '';    // New field for error message

  constructor(private groupService: GroupService, private socket: Socket, private http: HttpClient) {} // Inject HttpClient

  ngOnInit() {
    this.loadGroups(); 
    this.setupSocket(); // Setup socket events
  }

  loadGroups() {
    this.groupService.loadGroups().subscribe(
      (data) => {
        this.groups = data;
      },
      (error) => {
        console.error('Error loading groups:', error); // Error Handling
      }
    );
  }

  createGroup() {
    if (this.groupName) {
      this.groupService.createGroup(this.groupName).subscribe({
        next: (response) => {
          console.log('Group created', response);
          this.successMessage = `Group "${this.groupName}" created successfully!`;
          this.loadGroups(); // Refresh group list after creation
          this.groupName = ''; // Clear input field
          this.errorMessage = ''; // Clear any previous errors
        },
        error: (err) => {
          console.error('Error creating group:', err);
          this.errorMessage = 'Failed to create group. Please try again.';
          this.successMessage = ''; // Clear success message on error
        }
      });
    } else {
      this.errorMessage = 'Group name is required.';
      this.successMessage = '';
    }
  }

  removeGroup(groupId: string) {
    if (groupId) {
      this.groupService.removeGroup(groupId).subscribe({
        next: (response) => {
          console.log('Group removed', response);
          this.successMessage = 'Group removed successfully!';
          this.loadGroups(); // Reload group list
          this.errorMessage = '';
        },
        error: (err) => {
          console.error('Error removing group:', err);
          this.errorMessage = 'Failed to remove group. Please try again.';
          this.successMessage = ''; // Clear success message on error
        }
      });
    }
  }

  addChannel() {
    const channelData = {
      name: this.channelName // Get the value from the input
    };

    console.log('Adding channel with data:', channelData); // Log the data before sending

    if (this.channelName && this.selectedGroupId) {
      this.http.post<any>(`http://localhost:5000/api/groups/${this.selectedGroupId}/addChannel`, channelData)
        .subscribe(
          (response: any) => { 
            console.log('Channel added successfully:', response);
            this.successMessage = `Channel "${this.channelName}" added successfully!`;  // Set success message
            this.loadGroups(); 
            this.channelName = ''; // Clear input field
            this.errorMessage = ''; // Clear error message
          },
          (error: any) => { 
            console.error('Error adding channel:', error);
            this.errorMessage = 'Failed to add channel. Please try again.';
            this.successMessage = ''; // Clear success message on error
          }
        );
    } else {
      this.errorMessage = 'Channel name and group selection are required.';
      this.successMessage = ''; // Clear success message
    }
  }

  setupSocket() {
    this.socket.on('channelUpdated', (data: { groupId: string }) => {
      this.loadGroups(); 
    });
  }
}
