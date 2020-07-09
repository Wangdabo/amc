import { Component, OnInit, Input,ViewChild } from '@angular/core';
import {GlobalService} from '../../../service/global.service';
import {Router, NavigationEnd, ActivatedRoute,  RouterModule, ActivationEnd} from '@angular/router';
import { SiderComponent } from 'src/app/component/desktop/silder/sider.component';
import { SimpleReuseStrategy } from 'src/app/transaction-manage/command/simpleReuseStrategy';
import { filter } from 'rxjs/internal/operators';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
  providers:[SimpleReuseStrategy]
})
export class IndexComponent implements OnInit {


  constructor(private global: GlobalService,private router: Router,private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(filter(e => e instanceof ActivationEnd))
    .subscribe((e: ActivationEnd) => {
      const snapshot = e.snapshot;
      const isSkip = !(snapshot['_routerState'].url
                && snapshot.routeConfig.data
                && snapshot.routeConfig.data.useCache);
      if (isSkip) return;
    });


  }
  isCollapsed = false;
  isSearch = true;
  tabs = [];
  SelectedIndex = 0;


  @Input('params') params: any;
  @ViewChild('appSider', {static: true})
  sider: SiderComponent;
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
  closeTab(index){
   this.sider.closeTab(index);
  }
  nzSelectedIndexChange(event){
    let link ='/gov/dashbord/'+event.link;

    if(event.transCode!==undefined){

      link ='/gov/dashbord/'+event.link+'/'+event.transCode;
    }
    this.router.navigateByUrl(link);
    this.sider.localTab(event);
  }






}
