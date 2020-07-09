import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../service/global.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  constructor(private global: GlobalService, private router: Router) { }

  isCollapsed = false;
  isSearch = true;
  tabs = [];
  SelectedIndex = 0;

  ngOnInit() {
    this.global.getMessage().subscribe(msg => {
      this.isCollapsed = msg.isCollapsed;
      this.isSearch = !msg.isCollapsed; // 相反的
    });
  }


  clickActiveHandler(event){
    this.SelectedIndex = event.index;
    this.tabs = event.tabs;
  }

}
