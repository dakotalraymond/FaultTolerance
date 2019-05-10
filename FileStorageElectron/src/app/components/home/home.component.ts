import { Component, OnInit } from '@angular/core';
import { UdpService } from '../../services/udp.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(udpService: UdpService) { }

  ngOnInit() {
  }

}
