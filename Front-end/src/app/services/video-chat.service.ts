import { Injectable } from '@angular/core';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class VideoChatService {
  peer: Peer;

  constructor() {
    this.peer = new Peer({  
        host: 'localhost',
        port: 9000,
        path: '/peerjs'
      });
  }

  getPeerId(): Promise<string> {
    return new Promise((resolve) => {
      this.peer.on('open', (id: string) => {
        resolve(id);
      });
    });
  }

  callPeer(peerId: string, stream: MediaStream) {
    return this.peer.call(peerId, stream);
  }

  onCallAnswer(callback: (call: any) => void) {
    this.peer.on('call', (call) => callback(call));
  }
}
