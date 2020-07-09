import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { IfearmService } from '../../../../service/ifearm.service';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.less']
})
export class Error404Component implements OnInit {
  img = this.ifearm.imgSrc;

  constructor(
    private router: Router,
    private ifearm: IfearmService
  ) { }

  ngOnInit() {
  }

  gorouter() {
    this.router.navigateByUrl('gov/dashbord/govindex');
  }

}
