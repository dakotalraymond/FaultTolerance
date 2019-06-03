import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../models/message.model';
const dgram = require('dgram');



@Injectable()
export class ChatService {
  private server;
  private sendPort = 1982;
  private sendAddress = '127.0.0.1';
  private receivedMessages = new Subject<Message>();
  receivedMessages$ = this.receivedMessages.asObservable();
  constructor(private zone: NgZone) {
    this.server = dgram.createSocket('udp4');
    this.server.on('message', this.onServerMessage);
    this.server.on('listening', this.onServerConnect);
  }

  initializeSocket(boundPort: number, sendPort: number) {
    this.server.bind(boundPort, '127.0.0.1', true);
    this.sendPort = sendPort;
    let message = this.createConnectMessage();
    this.server.send(message, 0, message.length, this.sendPort, this.sendAddress, (err) => {
      if (err) {
        console.log(`There was an error sending udp message: ${err}`);
      }
      console.log('message sent');
    });
  }

  sendMessage(message: string) {
    let messageBuffer = Buffer.from(message);
    this.server.send(message, 0, message.length, this.sendPort, this.sendAddress, (err) => {
      if (err) {
        console.log(`There was an error sending udp message: ${err}`);
      }
    });
    let storedMessage = new Message(false, message);
    this.receivedMessages.next(storedMessage);
  }

  private onServerMessage = (msg: Buffer) => {
    let receivedMessage = new Message(true, msg.toString());
    this.zone.run(() => {
      this.receivedMessages.next(receivedMessage);
    });
  }

  private onServerConnect = () => {
    const address = this.server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  }

  private createConnectMessage() {
    let messageBuf = Buffer.alloc(48);
    return messageBuf;
  }
}
