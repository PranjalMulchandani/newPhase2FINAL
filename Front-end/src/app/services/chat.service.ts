

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:5000');  // Connect to your socket.io server
  }
  joinRoom(groupId: string, channelId: string) {
    console.log(`Joining room: ${groupId}, channel: ${channelId}`);
    this.socket.emit('joinRoom', { groupId, channelId }); // Ensure you are sending the correct identifiers
  }
  
  sendMessage(groupId: string, channelId: string, messageData: { content: string; userId: string | null }) { 
    console.log(`Sending message to group: ${groupId}, channel: ${channelId}`, messageData);
    this.socket.emit('chatMessage', { groupId, channelId, message: messageData }); 
  }
  uploadImage(formData: FormData) {
    return this.http.post('http://localhost:5000/api/chat/upload-image', formData);
  }
  

  // Listen for incoming messages from the server
  receiveMessages(): Observable<any> { 
    return new Observable((observer) => {
      this.socket.on('message', (message) => {
        console.log('New message received:', message);
        observer.next(message);
      });
    });
  }

  // Method to leave a specific room
  leaveRoom(group: string, channel: string) {
    console.log(`Leaving room: ${group}, channel: ${channel}`);
    this.socket.emit('leaveRoom', { group, channel });
  }

  // Additional method to listen for users joining the channel in real-time
  userJoined(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('userJoined', (data) => {
        console.log('User joined channel:', data);
        observer.next(data);
      });
    });
  }
  getChatHistory(groupId: string, channelId: string) {
    return new Observable((observer) => {
      this.socket.emit('getChatHistory', { groupId, channelId });
    });
  }

  // Additional method to listen for users leaving the channel in real-time
  userLeft(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('userLeft', (data) => {
        console.log('User left channel:', data);
        observer.next(data);
      });
    });
  }
}
