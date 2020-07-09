import { Component, OnInit, ViewChild } from '@angular/core';
import {
    BaseTransaction, ServiceTypeEnum, ShareParamsService, TransactionActionApiService, TransactionActionData,
    TransactionDefManager
} from 'tms-platform';
import { FormComponent } from 'tms-platform-component';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';

@Component({
    selector: 'app-publish',
    templateUrl: './publish.component.html',
    styleUrls: ['./publish.component.css']
})
export class PublishComponent extends BaseTransaction implements OnInit {
    APP_NAME = [{
        name: 'PAD移动智能终端',
        value: 'pit'
    }];
    WORKSTATION_TYPE = [{
        name: '客户端',
        value: 'client'
    }, {
        name: '服务端',
        value: 'server'
    }];
    MODULE_TYPE = [{
        name: '平台',
        value: '0'
    }, {
        name: '插件',
        value: '1'
    }];
    PLAT_CODE = [{
        name: '安卓',
        value: 'android'
    }, {
        name: 'h5',
        value: 'h5'
    }, {
        name: 'windows',
        value: 'windows'
    }];
    @ViewChild('baseForm', { static: true })
    baseForm: FormComponent;
    transactionActionData: { [actionCode: string]: TransactionActionData };
    files = [];
    fileData = {
        user: ''
    };
    headers = {
        Authorization: ''
    };
    showUploadList = true;
    constructor (private shareParamsService: ShareParamsService,
        private transactionActionApiService: TransactionActionApiService,
        private router: Router, public global: GlobalService) {
        super(shareParamsService);
    }

    ngOnInit() {
        this.transactionActionData = this.transactionContextManager.getCurrentTransactionData(); // 获取交易上下文行为对象
        const user = sessionStorage.getItem('user');
        this.fileData.user = JSON.parse(user).user_code;
        const header = sessionStorage.getItem('header');
        this.headers.Authorization = JSON.parse(header).Authorization;
        this.transactionActionApiService.submitAction('queryApp');
        this.transactionActionData['publish'].request.requestdata.bdy.versioninfo.workstation_type = 'client';
        setTimeout(() => {
            this.baseForm.disabled('workstation_type', true);
        });
    }
    /**
     * 发布
     */
    publish(): void {
        this.transactionActionApiService.submitAction('publish'); // 调用新增还是修改方法
    }
    /**
     * 行为提交前钩子函数，一般在此处做表单校验
     */
    beforeSubmitCheck(actionCode: string): boolean {
        if (actionCode === 'publish') {
            return this.baseForm.valid();
        }
        return true;
    }
    addModule() {
        this.transactionActionData['publish'].request.requestdata.bdy.moduleList.push({});
    }
    deleteItem(item) {
        const index = this.transactionActionData['publish'].request.requestdata.bdy.moduleList.indexOf(item);
        if (index > -1) {
            this.transactionActionData['publish'].request.requestdata.bdy.moduleList.splice(index, 1);
        }
    }

    appNameChange($event) {
        if (!$event || $event === '') return;
        this.transactionActionData['queryPlugin'].request.requestdata.bdy.data.params[0].queryList[0].params[1] = $event;
        this.transactionActionApiService.submitAction('queryPlugin'); // 调用新增还是修改方法
    }

    afterSubmit(actionCode: string) { // 钩子，拿到响应，如果不需要在ts里处理，可以直接在html中 双向绑定使用 transactionActionData
        switch (actionCode) {
            case 'queryPlugin':
                console.log(this.transactionActionData['queryPlugin'].response);
                break;
            case 'publish':
                alert('发布成功');
                history.go(-1);
                break;
        }
    }
    fileChange(event, item) {
        if (event.type === 'success') {
            item.module_file_path = event.file.response.resultdata.filePath[0];
            item.uid = event.file.uid;
        }
    }
    moveFile = (item, i, file: File) => {
        const index = this.files[i].indexOf(file);
        if (index > -1) {
            this.files[i].splice(index, 1);
        }
        item.module_file_path = '';
    }
    cancel() {
        history.go(-1);
    }
}
