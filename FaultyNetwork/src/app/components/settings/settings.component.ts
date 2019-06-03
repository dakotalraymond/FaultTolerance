import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  boundPort = 1992;
  sendPort = 1982;
  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  handleConnectClick() {
    this.chatService.initializeSocket(this.boundPort, this.sendPort);
  }

  handleSendClick() {
  }
}
