import { Component, OnInit } from '@angular/core';
import {IfearmService} from '../../../service/ifearm.service';
import {SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.less']
})
export class DashbordComponent implements OnInit {
  orbitUrl: SafeResourceUrl;
  ngOnInit(): void {
    this.orbitUrl = this.ifearm.microserviceMonitoring;
  }
  constructor(public ifearm: IfearmService
  ) {
  }
}
