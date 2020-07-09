import { Component, OnInit } from '@angular/core';
import {
  BaseTransaction,
  CommonActionCodeContants, ShareParamsService, TransactionActionApiService, TransactionActionData,
  TransactionActionDefManager,
  TransactionDefManager
} from "tms-platform";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalService} from "../../../../service/global.service";


@Component({
  selector: 'app-tx990600',
  templateUrl: './tx990600.component.html',
  styleUrls: ['./tx990600.component.css']
})
export class Tx990600Component extends BaseTransaction implements OnInit {

  constructor(private router: Router, private global: GlobalService,
              private shareParamsService: ShareParamsService,
              private transactionActionApiService: TransactionActionApiService,
              public activatedRoute: ActivatedRoute) {
    super(shareParamsService);
  }

  transactionActionData: { [actionCode: string]: TransactionActionData };


  ngOnInit() {
    this.transactionActionData = this.transactionContextManager.getCurrentTransactionData(); // 获取交易上下文行为对象
  }


  afterSubmit(actionCode: string) { // 钩子，拿到响应，如果不需要在ts里处理，可以直接在html中 双向绑定使用 transactionActionData
    switch (actionCode) {
      case 'common_query':
        break;
    }
  }

  // 跳转子路由方法
  routerChild() {
    // this.transactionActionData['clickType'] = item; //  通过上下文传递详情给子交易
    this.transactionActionApiService.routeChildren('tx990601', this.activatedRoute);
  }


}

// 注册交易
TransactionDefManager.registe({
  transCode: 'tx990600', // 交易代码
  transName: '知识库', // 交易名称
  transActions: TransactionActionDefManager.createCrudActionDef({svcCode: 'TX001', tableName: 'btf_app'}), // 自动创建增删该查交易
  mainActionCode: CommonActionCodeContants.QUERY // 主行为，可使用F5调用
});
