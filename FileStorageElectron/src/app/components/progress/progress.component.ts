import { Component, OnInit, OnDestroy } from '@angular/core';
import { UdpService } from '../../services/udp.service';
import { ProcessChunkStatus } from '../../models/process-chunk-status.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnDestroy {
  chunkList: ProcessChunkStatus[] = [];

  private processSubscription: Subscription;

  constructor(public udpService: UdpService) { }

  ngOnInit() {
    this.processSubscription = this.udpService.processProgress$.subscribe(x => {
      if (!x) {
        this.chunkList = [];
      } else {
        this.chunkList.push(x);
      }
    });
  }
  ngOnDestroy(): void {
    this.processSubscription.unsubscribe();
  }
}
