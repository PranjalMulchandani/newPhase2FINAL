import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VideoChatService } from '../../services/video-chat.service';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit {
  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('peerVideo') peerVideo!: ElementRef<HTMLVideoElement>;

  myPeerId: string = '';
  peerConnectionId: string = '';  

  constructor(private videoChatService: VideoChatService) {}

  ngOnInit(): void {
    this.initializePeer();
  }

  initializePeer() {
    this.videoChatService.getPeerId().then((id: string) => {
      this.myPeerId = id;
      console.log('My Peer ID:', this.myPeerId);
    });

    this.videoChatService.onCallAnswer((call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        this.myVideo.nativeElement.srcObject = stream;
        this.myVideo.nativeElement.play();
        call.answer(stream);

        call.on('stream', (peerStream: MediaStream) => {
          this.peerVideo.nativeElement.srcObject = peerStream;
          this.peerVideo.nativeElement.play();
        });
      });
    });
  }

  callPeer() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      const call = this.videoChatService.callPeer(this.peerConnectionId, stream);
      this.myVideo.nativeElement.srcObject = stream;
      this.myVideo.nativeElement.play();

      call.on('stream', (peerStream: MediaStream) => {
        this.peerVideo.nativeElement.srcObject = peerStream;
        this.peerVideo.nativeElement.play();
      });
    });
  }
}
