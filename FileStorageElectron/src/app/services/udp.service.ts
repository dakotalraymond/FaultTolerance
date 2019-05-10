import { Injectable } from '@angular/core';
const dgram = require('dgram');

@Injectable()
export class UdpService {
  private server;
  constructor() {
    this.server = dgram.createSocket('udp4');

    this.server.on('message', (msg, rinfo) => {
      // console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });

    this.server.on('listening', () => {
      const address = this.server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    this.server.bind(6000);
  }


}
