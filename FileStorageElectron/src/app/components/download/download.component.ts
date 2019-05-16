import { Component, OnInit, OnDestroy } from '@angular/core';
import { UdpService } from '../../services/udp.service';
import { FileModel } from '../../models/file.model';
import { Subscription } from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DownloadComponent implements OnInit, OnDestroy {
  columnsToDisplay: string[] = ['name'];
  fileList: FileModel[] = [];
  private fileListSubscription: Subscription;
  constructor(private udpService: UdpService) { }

  ngOnInit() {
    this.fileListSubscription = this.udpService.fileList$.subscribe(file => {
      this.fileList = [...this.fileList, file];
    });
  }

  ngOnDestroy() {
    this.fileListSubscription.unsubscribe();
  }

  onDownloadClick(file: FileModel) {
    console.log(`Downloading ${file.name}`);
    this.udpService.downloadFile(file);
  }
}
