import { Injectable } from '@angular/core';
const dgram = require('dgram');
const fs = require('fs');
import { Subject } from 'rxjs';
import { ProcessChunkStatus } from '../models/process-chunk-status.model';
import { FileModel } from '../models/file.model';
import { FileChunkModel } from '../models/file-chunk.model';
import bitwise from 'bitwise';

@Injectable()
export class UdpService {
  private server;

  private progressSubject = new Subject<ProcessChunkStatus>();
  private fileListSubject = new Subject<FileModel>();
  private messageQueue: Buffer[] = [];
  private lastSentMessage: Buffer;

  private sendPort = 1982;
  private sendAddress = '127.0.0.1';
  private numberOfCopies = 5;
  viewDetailMode = true;
  operationInProgress = false;
  operationTime;
  private startTime;

  private cachedDataVotes: FileChunkModel[] = [];

  processProgress$ = this.progressSubject.asObservable();
  fileList$ = this.fileListSubject.asObservable();

  constructor() {
    // Initialize server
    this.server = dgram.createSocket('udp4');
    this.server.on('message', this.onServerMessage);
    this.server.on('listening', this.onServerConnect);
    this.server.bind(1983, '127.0.0.1', false);
  }

  writeFileChunk(chunk: FileChunkModel) {
    let fd = fs.openSync(`C:\\Users\\draymond\\Desktop\\retrievedFiles\\${chunk.name}`, 'a');
    fs.writeSync(fd, chunk.data, 0, chunk.data.length, chunk.position);
    fs.closeSync(fd);
  }

  downloadFile(file: FileModel) {
    this.startOperation();
    this.updateProgress(null);
    this.cachedDataVotes = [];
    let fd = fs.openSync(`C:\\Users\\draymond\\Desktop\\retrievedFiles\\${file.name}`, 'w');
    fs.closeSync(fd);
    this.enqueueReadMessages(file);
    this.sendMessageFromQueue();
  }

  uploadFile(fileName: string, filePath: string) {
    this.startOperation();
    this.updateProgress(null);
    let fileData = fs.readFileSync(filePath);
    let byteChunkCount = Math.ceil(fileData.length / 10);
    let file = new FileModel(fileName, byteChunkCount);
    this.enqueueWriteMessages(file, fileData);
    this.sendMessageFromQueue();
    this.fileListSubject.next(file);
  }

  private startOperation() {
    this.operationInProgress = true;
    this.startTime = process.hrtime();
  }

  private endOperation() {
    this.operationInProgress = false;
    this.operationTime = process.hrtime(this.startTime);
  }

  private handleDataMessage(msg: Buffer) {
    let valid = msg.readInt8(48);
    if (valid) {
      this.updateProgress(new ProcessChunkStatus(true));
      let fileChunk = new FileChunkModel(undefined, undefined, undefined);
      fileChunk.name = msg.toString('ASCII', 1, 32).replace(/\0/g, '');
      fileChunk.position = msg.readUInt32LE(33);
      let dataLength = msg.readInt8(37);
      fileChunk.data = Buffer.alloc(dataLength);
      msg.copy(fileChunk.data, 0, 38, 38 + dataLength);
      let splitName = fileChunk.name.split('.');
      let copyNumber = parseInt(splitName[0].charAt(splitName[0].length - 1), 10);

      if (copyNumber === 0) {
        this.cachedDataVotes = [];
      }

      this.cachedDataVotes.push(fileChunk);

      if (copyNumber === (this.numberOfCopies - 1)) {
        fileChunk.name = `${splitName[0].slice(0, -1)}.${splitName[1]}`;
        fileChunk.data = this.voteBuffers(this.cachedDataVotes);
        this.writeFileChunk(fileChunk);
      }

      this.sendMessageFromQueue();
    } else  {
      this.updateProgress(new ProcessChunkStatus(false));
      this.server.send(this.lastSentMessage, 0, this.lastSentMessage.length, this.sendPort, this.sendAddress, (err) => {
        if (err) {
          console.log(`There was an error sending udp message: ${err}`);
        }
      });
    }
  }

  private updateProgress(chunk: ProcessChunkStatus) {
    if (this.viewDetailMode) {
      this.progressSubject.next(chunk);
    }
  }

  private handleAckMessage(msg: Buffer) {
    let valid = msg.readInt8(48);
    if (valid) {
      this.updateProgress(new ProcessChunkStatus(true));
      this.sendMessageFromQueue();
    } else  {
      this.updateProgress(new ProcessChunkStatus(false));
      this.server.send(this.lastSentMessage, 0, this.lastSentMessage.length, this.sendPort, this.sendAddress, (err) => {
        if (err) {
          console.log(`There was an error sending udp message: ${err}`);
        }
      });
    }
  }

  private sendMessageFromQueue() {
    if (this.messageQueue.length > 0) {
      let message = this.messageQueue.shift();
      this.lastSentMessage = message;
      this.server.send(message, 0, message.length, this.sendPort, this.sendAddress, (err) => {
        if (err) {
          console.log(`There was an error sending udp message: ${err}`);
        }
      });
    } else {
      this.endOperation();
    }
  }

  private enqueueReadMessages(file: FileModel) {
    for (let i = 0; i < file.byteChunkCount; i++) {
      for (let j = 0; j < this.numberOfCopies; j++) {
        let messageBuf = Buffer.alloc(37);

        // Op code
        messageBuf.write('R', 0, 1);

        // File name
        let splitName = file.name.split('.');
        messageBuf.write(`${splitName[0]}${j}.${splitName[1]}`, 1, 32);

        // File data location
        messageBuf.writeUInt32LE(i * 10, 33);

        this.messageQueue.push(messageBuf);
      }
    }
  }

  private enqueueWriteMessages(file: FileModel, data: Buffer) {
    for (let i = 0; i < file.byteChunkCount; i++) {
      for (let j = 0; j < this.numberOfCopies; j++) {
        let messageBuf = Buffer.alloc(48);

        // Op code
        messageBuf.write('W', 0, 1);

        // File name
        let splitName = file.name.split('.');
        messageBuf.write(`${splitName[0]}${j}.${splitName[1]}`, 1, 32);

        // File data location
        messageBuf.writeUInt32LE(i * 10, 33);

        let dataWriteEnd = (i * 10) + 10;
        if (dataWriteEnd > data.length) {
          dataWriteEnd = data.length;
        }
        let dataLength = dataWriteEnd - (i * 10);

        // Data length
        messageBuf.writeIntLE(dataLength, 37, 1);

        // Data
        data.copy(messageBuf, 38, i * 10, dataWriteEnd);

        this.messageQueue.push(messageBuf);
      }
    }
  }

  private voteBuffers(buffers: FileChunkModel[]): Buffer {
    let arrayOfBufferArrays = [];
    let outputBitArray = [];
    let outputSumArray = [];

    let majorityCount = Math.ceil(this.numberOfCopies / 2);

    for (let i = 0; i < this.numberOfCopies; i++) {
      arrayOfBufferArrays.push(bitwise.buffer.read(buffers[i].data));
    }

    for (let i = 0; i < arrayOfBufferArrays[0].length; i++) {
      outputSumArray.push(0);
      outputBitArray.push(0);

      for (let j = 0; j < this.numberOfCopies; j++) {
        outputSumArray[i] += arrayOfBufferArrays[j][i];
      }

      if (outputSumArray[i] >= majorityCount) {
        outputBitArray[i] = 1;
      }
    }
    let returnedBuffer = bitwise.buffer.create(outputBitArray);
    return returnedBuffer;
  }

  private onServerConnect = () => {
    const address = this.server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  }

  private onServerMessage = (msg, rinfo) => {
    let test: string = msg.toString();
    if (test.charAt(0) === 'D') {
      this.handleDataMessage(msg);
    } else if (test.charAt(0) === 'A') {
      this.handleAckMessage(msg);
    } else {
      console.log(`Unrecognized Message Type ${test.charAt(0)}`);
    }
  }

}
