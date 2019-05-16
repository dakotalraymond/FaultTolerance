import { Injectable } from '@angular/core';
const dgram = require('dgram');
const fs = require('fs');
import { Subject } from 'rxjs';
import { ProcessChunkStatus } from '../models/process-chunk-status.model';
import { FileModel } from '../models/file.model';
import { FileChunkModel } from '../models/file-chunk.model';

@Injectable()
export class UdpService {
  private server;

  private progressSubject = new Subject<ProcessChunkStatus>();
  private fileListSubject = new Subject<FileModel>();
  private messageQueue: Buffer[] = [];
  private lastSentMessage: Buffer;

  private sendPort = 1982;
  private sendAddress = '127.0.0.1';

  private isUploadMode = false;

  private cachedDataBuffers: Buffer[] = [];
  private cachedData: FileChunkModel;

  processProgress$ = this.progressSubject.asObservable();
  fileList$ = this.fileListSubject.asObservable();

  constructor() {
    this.server = dgram.createSocket('udp4');
    this.server.on('message', (msg, rinfo) => {

      let test: string = msg.toString();
      if (test.charAt(0) === 'D') {
        this.handleDataMessage(msg);
      } else if (test.charAt(0) === 'A') {
        this.handleAckMessage(msg);
      } else {
        console.log(`Unrecognized Message Type ${test.charAt(0)}`);
      }

    });

    this.server.on('listening', () => {
      const address = this.server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    this.server.bind(1983, '127.0.0.1', false);
  }

  writeCachedFilePart() {
    let fd = fs.openSync(`C:\\Users\\draymond\\Desktop\\retrievedFiles\\${this.cachedData.name}`, 'a');
    fs.writeSync(fd, this.cachedData.data, 0, this.cachedData.data.length, this.cachedData.position);
    fs.closeSync(fd);
  }

  downloadFile(file: FileModel) {
    this.cachedDataBuffers = [];
    this.isUploadMode = false;
    let fd = fs.openSync(`C:\\Users\\draymond\\Desktop\\retrievedFiles\\${file.name}`, 'w');
    fs.closeSync(fd);
    this.enqueueReadMessages(file);
    this.sendMessageFromQueue();
  }

  uploadFile(fileName: string, filePath: string) {
    this.isUploadMode = true;
    let fileData = fs.readFileSync(filePath);
    let byteChunkCount = Math.ceil(fileData.length / 10);
    let file = new FileModel(fileName, byteChunkCount);
    this.enqueueWriteMessages(file, fileData);
    this.sendMessageFromQueue();
    this.fileListSubject.next(file);
  }

  private handleDataMessage(msg: Buffer) {
    let valid = msg.readInt8(47);
    if (valid) {
      this.progressSubject.next(new ProcessChunkStatus(true));
      let fileChunk = new FileChunkModel(undefined, undefined, undefined);
      fileChunk.name = msg.toString('ASCII', 1, 32).replace(/\0/g, '');
      fileChunk.position = msg.readUInt32LE(33);
      fileChunk.data = Buffer.alloc(10);
      msg.copy(fileChunk.data, 0, 37, 47);
      this.cachedData = fileChunk;
      this.writeCachedFilePart();
      this.sendMessageFromQueue();
    } else  {
      this.progressSubject.next(new ProcessChunkStatus(false));
      this.server.send(this.lastSentMessage, 0, this.lastSentMessage.length, this.sendPort, this.sendAddress, (err) => {
        if (err) {
          console.log(`There was an error sending udp message: ${err}`);
        }
      });
    }
  }

  private handleAckMessage(msg: Buffer) {
    let valid = msg.readInt8(47);
    if (valid) {
      this.progressSubject.next(new ProcessChunkStatus(true));
      this.sendMessageFromQueue();
    } else  {
      this.progressSubject.next(new ProcessChunkStatus(false));
      this.server.send(this.lastSentMessage, 0, this.lastSentMessage.length, this.sendPort, this.sendAddress, (err) => {
        if (err) {
          console.log(`There was an error sending udp message: ${err}`);
        }
      });
    }
  }

  private sendMessageFromQueue() {
    if (this.messageQueue.length > 0) {
      let message = Buffer.from(this.messageQueue.shift());
      this.lastSentMessage = message;
      this.server.send(message, 0, message.length, this.sendPort, this.sendAddress, (err) => {
        if (err) {
          console.log(`There was an error sending udp message: ${err}`);
        }
      });
    }
  }

  private enqueueReadMessages(file: FileModel) {
    for (let i = 0; i < file.byteChunkCount; i++) {
      let messageBuf = Buffer.alloc(37);

      messageBuf.write('R', 0, 1);
      messageBuf.write(file.name, 1, 32);
      messageBuf.writeUInt32LE(i * 10, 33);

      this.messageQueue.push(messageBuf);
    }
  }

  private enqueueWriteMessages(file: FileModel, data: Buffer) {
    for (let i = 0; i < file.byteChunkCount; i++) {
      let messageBuf = Buffer.alloc(47);

      messageBuf.write('W', 0, 1);
      messageBuf.write(file.name, 1, 32);
      messageBuf.writeUInt32LE(i * 10, 33);

      let dataWriteEnd = (i * 10) + 10;

      if (dataWriteEnd > data.length) {
        dataWriteEnd = data.length;
      }

      data.copy(messageBuf, 37, i * 10, dataWriteEnd);

      this.messageQueue.push(messageBuf);
    }
  }

}
