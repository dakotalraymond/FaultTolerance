import { Component, OnInit, OnDestroy } from '@angular/core';
import { UdpService } from '../../services/udp.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  constructor(public udpService: UdpService) { }

  ngOnInit() {
  }
  ngOnDestroy(): void {
  }
}
