import { Component, OnInit, ElementRef } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { IfearmService } from 'src/app/service/ifearm.service';

@Component({
  selector: 'app-tx990617',
  templateUrl: './tx990617.component.html',
  styleUrls: ['./tx990617.component.css']
})
export class Tx990617Component implements OnInit {
  orbitUrl: SafeResourceUrl;
  constructor(public ifearm: IfearmService,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.orbitUrl = 'http://60.216.75.202:8080/default/aimpc/index.html#/customerDetail/sysadmin/123456/2?cust_id=1167171496';
  }

}
