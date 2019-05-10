import { Injectable } from '@angular/core';
const dgram = require('dgram');

@Injectable()
export class UdpService {
  private server;
  constructor() {
    this.server = dgram.createSocket('udp4');

    this.server.on('message', (msg, rinfo) => {

      let test: string = msg.toString();
      if (test.charAt(0) === 'D') {
        this.handleDataMessage(msg);
      } else {
        console.log('Unrecognized Message Type');
      }

    });

    this.server.on('listening', () => {
      const address = this.server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    this.server.bind(6000);
  }

  private handleDataMessage(msg: Buffer) {
    console.log(`server got: ${msg}`);
  }


}
