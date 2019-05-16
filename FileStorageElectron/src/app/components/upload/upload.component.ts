import { Component, OnInit } from '@angular/core';
import { UdpService } from '../../services/udp.service';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FileModel } from '../../models/file.model';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor(private udpService: UdpService) { }

  ngOnInit() {
  }

  onFileDrop(event: UploadEvent) {
    for (const droppedFile of event.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {
          console.log(droppedFile.relativePath, file);
          this.udpService.uploadFile(file.name, file.path);
        });
      }
    }
  }
}
