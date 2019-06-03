import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  public chatInput: string;

  constructor(private chatService: ChatService) {

  }

  ngOnInit() {

  }

  handleSendClick() {
    this.chatService.sendMessage(this.chatInput);
    this.chatInput = '';
  }
}
