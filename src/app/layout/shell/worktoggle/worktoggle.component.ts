import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-worktoggle',
  templateUrl: './worktoggle.component.html',
  styleUrls: ['./worktoggle.component.less']
})
export class WorktoggleComponent implements OnInit {

  constructor(    private router: Router,) { }

  ngOnInit() {
  }

  radios = [
    {workname: '数据运营中心', value:'aiops', imgsrc: './assets/newimage/workshoptoggle/bg_shujuyunying.png'},
    {workname: '业务管理中心', value:'gov', imgsrc: './assets/newimage/workshoptoggle/bg_yewuguanli.png'},
    {workname: '运维中心', value:'ops', imgsrc: './assets/newimage/workshoptoggle/bg_yunwei.png'},
  ];

  clickToggle(item) {
    switch (item) {
      case 'aiops':
        this.router.navigateByUrl('aiops/dashbord/transaction/tx990239');
        break;
      case 'gov':
        this.router.navigateByUrl('gov/dashbord/transaction/tx990518');
        break;
      case 'ops':
        // this.router.navigateByUrl('ops/dashbord/transaction/tx990239');
        this.router.navigateByUrl('ops/dashbord/transaction/tx990530');
        break;
    }
  }


}
