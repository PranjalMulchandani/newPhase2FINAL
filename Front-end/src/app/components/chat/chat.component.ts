
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service'; 
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message = '';
  messages: any[] = [];
  groups: any[] = []; 
  selectedGroup: any;
  selectedChannel: any;
  channels: any[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private groupService: GroupService, 
    private socket: Socket
  ) { }

  ngOnInit(): void {
    this.loadGroups();

    // Listen for incoming messages from the server
    this.socket.on('message', (message: any) => {
      console.log('New message received from socket:', message);
      this.messages.push({
        ...message,
        avatarUrl: message.senderAvatar // Add avatar URL to the message object
      }); 
    });

    // Listen for user joining the channel
    this.socket.on('userJoined', (data: any) => {
      console.log('User joined:', data);
      this.messages.push({ content: data.message, userId: null }); // Show the join notification
    });

    // Listen for user leaving the channel
    this.socket.on('userLeft', (data: any) => {
      console.log('User left:', data);
      this.messages.push({ content: data.message, userId: null }); // Show the leave notification
    });
  }

  loadGroups() {
    this.groupService.loadGroups().subscribe(
      (data: any) => {
        this.groups = data; 
      },
      (error) => {
        console.error('Error loading groups:', error);
      }
    );
  }

  onGroupSelect() {
    this.channels = this.selectedGroup.channels; 
    this.selectedChannel = null; 
    this.messages = []; 
  }

  onChannelSelect() {
    this.messages = []; 
    if (this.selectedChannel) {
      this.chatService.joinRoom(this.selectedGroup._id, this.selectedChannel._id);
      
      // Subscribe to message updates
      this.chatService.receiveMessages().subscribe((message: any) => {
        console.log('New message received in onChannelSelect:', message);
        this.messages.push(message);
      });
    }
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }
  
  sendMessage() {
    const userId = this.authService.getToken();
  
    if (this.message.trim() && this.selectedGroup && this.selectedChannel) {
      // Send a text message
      const payload = { content: this.message, userId };
      this.chatService.sendMessage(this.selectedGroup._id, this.selectedChannel._id, payload);
      this.message = '';
    } else if (this.selectedFile) {
      // Send an image message
      const formData = new FormData();
      formData.append('image', this.selectedFile);
  
      this.chatService.uploadImage(formData).subscribe((response: any) => {
        const imageUrl = response.imageUrl;
        const payload = { content: `<img src="${imageUrl}" alt="Image" />`, userId };
        this.chatService.sendMessage(this.selectedGroup._id, this.selectedChannel._id, payload);
        this.selectedFile = null;
      });
    }
  }
  loadChatHistory() {
    this.chatService.getChatHistory(this.selectedGroup._id, this.selectedChannel._id).subscribe(
      (history: any) => {
        this.messages = history;
      },
      (error) => {
        console.error('Error loading chat history:', error);
      }
    );
  }
}
