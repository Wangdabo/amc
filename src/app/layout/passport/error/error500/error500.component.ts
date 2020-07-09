import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IfearmService } from '../../../../service/ifearm.service';

@Component({
  selector: 'app-error500',
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.less']
})
export class Error500Component implements OnInit {
  img = this.ifearm.imgSrc;

  constructor(private router: Router,
    private ifearm: IfearmService

  ) { }

  ngOnInit() {
  }

  gorouter() {
    this.router.navigateByUrl('gov/dashbord/govindex');
  }

}
