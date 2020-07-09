import { Component, OnInit, ViewChild } from '@angular/core';
import {
    BaseTransaction,
    CommonActionCodeContants,
    ShareParamsService,
    TransactionActionApiService,
    TransactionActionData,
    TransactionActionDefManager,
    TransactionDefManager
} from 'tms-platform';
import { FormComponent } from 'tms-platform-component';
import { ContextService } from '../../../../workshop/context/context.service';
import { timingSafeEqual } from 'crypto';
import {
    BsaApi,
    DcsApi,
    NativeApi,
    ServiceRequest,
    ServiceTypeEnum
} from 'tms-platform';
import { unsupported } from '@angular/compiler/src/render3/view/util';
import {
    NzModalService,
    NzNotificationService,
    NzMessageService
} from 'ng-zorro-antd';
import { UtilityService } from 'src/app/service/utils.service';
@Component({
    selector: 'app-tx990619',
    templateUrl: './tx990619.component.html',
    styleUrls: ['./tx990619.component.css']
})
export class Tx990619Component implements OnInit {
    constructor (
        private bsaApi: BsaApi,
        public transactionActionApiService: TransactionActionApiService,
        private utility: UtilityService,
        private message: NzMessageService
    ) { }
    total = 0; //  总数据
    pageIndex = 1; // 当前页
    pageTotalNumber = 10; // 指定每页显示多少条
    listData = [];
    isVisible = false;
    rowActions = [
        { key: 'detail', label: '查看设备' },
        {
            key: 'update',
            label: '关联设备'
        }
    ];

    queryHeader = [
        { label: '机构名称', value: 'org_name', type: 'input', filedType: 'string' },
        { label: '机构代码', value: 'org_code', type: 'input', filedType: 'string' }
    ];

    listHeader = [
        { key: 'org_work_status', label: '工作状态', dictId: 'SYS_ORG_WORK_STATUS' },
        { key: 'cash_user_cnt', label: '现金内库柜员数量' },
        {
            key: 'org_name',
            label: '机构名称'
        },
        {
            key: 'org_code',
            label: '网点机构代码'
        },
        {
            key: 'mcctl_user_cnt',
            label: '重空内库柜员数量'
        }
    ];
    modal = {
        listHeader: [
            {
                key: 'workstation_code',
                label: '工作站代码'
            },
            {
                key: 'version_no',
                label: '版本号'
            },
            {
                key: 'workstation_name',
                label: '工作站名称'
            },
            {
                key: 'workstation_kind',
                label: '工作站类别',
                dictId: 'SYS_WORKSTATION_KIND'
            },
            {
                key: 'workstation_status',
                label: '工作站状态',
                dictId: 'SYS_WORKSTATION_STATUS'
            },
            {
                key: 'workstation_switch',
                label: '工作站开关',
                dictId: 'SYS_WORKSTATION_SWITCH'
            }
        ],
        listData: [],
        total: 0, //  总数据
        pageIndex: 1 // 当前页，
    };
    receivingValue = [
        { name: '手机', value: '0' },
        { name: '平板', value: '1' },
    ];
    form = {
        // wscode: null,
        empcode: null,
        rolecode: null,
        orgcode: null
    };
    emp: string;
    user: string;
    deviceValue: string;
    selectItem: any;
    params: any;
    showIndex: boolean;
    deviceList = [];
    roleList = [];
    userList = [];
    current = 0;

    index = 'First-content';
    allChecked = false;
    indeterminate = true;

    pre(): void {
        this.current -= 1;
        this.changeContent();
    }

    next(): void {
        this.current += 1;
        this.changeContent();
    }

    done(): void {

        console.log('done');
    }
    changeContent(): void {
        switch (this.current) {
            case 0: {
                this.index = 'First-content';
                break;
            }
            case 1: {
                this.queryUser();
                this.index = 'Second-content';
                break;
            }
            case 2: {
                this.queryDevice();
                this.index = 'third-content';
                break;
            }
            default: {
                this.index = 'error';
            }
        }
    }
    updateAllChecked(): void {
        this.indeterminate = false;
        if (this.allChecked) {
            this.deviceList = this.deviceList.map(item => {
                return {
                    ...item,
                    checked: true
                };
            });
        } else {
            this.deviceList = this.deviceList.map(item => {
                return {
                    ...item,
                    checked: false
                };
            });
        }
    }

    updateSingleChecked(): void {

        if (this.deviceList.every(item => !item.checked)) {
            this.allChecked = false;
            this.indeterminate = false;
        } else if (this.deviceList.every(item => item.checked)) {
            this.allChecked = true;
            this.indeterminate = false;
        } else {
            this.indeterminate = true;
        }
    }
    ngOnInit() {
        this.getData();
    }
    pageChange(event) {
        this.pageIndex = event.pageIndex;
        this.getData();
    }

    getData() {
        let serviceRequest: ServiceRequest;
        serviceRequest = {
            funccode: 'list',
            svccode: 'TP550000',
            svctype: '0',
            requestdata: {
                bdy: {},
                coh: {},
                ctl: {
                    pageinfo: {
                        page: this.pageIndex,
                        pagesize: '10'
                    }
                }
            }
        };
        this.utility.post('/cust/customer', serviceRequest).then(items => {
            if (items['returncode'] === '000000') {
                console.log(items['resultdata']['bdy'])
                this.total = items['resultdata']['bdy']['count'];
                this.listData = items['resultdata']['bdy']['data'];
                console.log(this.listData);
            }
        });
    }

    rowActionsHandler($event) {
        this.isVisible = true;
        this.selectItem = $event.item;
        if ($event.key === 'detail') {
            this.showIndex = true;
            this.detail($event.item).then(items => {
                this.modal.total = items['resultdata']['bdy']['count'];
                this.modal.listData = items['resultdata']['bdy']['data'];
            });
        } else {
            this.queryOrg();
            this.form.orgcode = $event.item.org_code;
            console.log(this.form);
            this.current = 0;
            this.form.empcode = null;
            this.form.rolecode = null;
            // this.receivingValue = null;
            // this.emp = null;
            // this.user = null;
            // this.deviceValue = null;
            this.showIndex = false;
        }
    }
    detail(event) {
        let serviceRequest: ServiceRequest;
        serviceRequest = {
            funccode: 'devicelist',
            svccode: 'TP550000',
            svctype: '0',
            requestdata: {
                bdy: {
                    orgcode: event.org_code
                },
                coh: {},
                ctl: {
                    pageinfo: {
                        page: this.pageIndex,
                        pagesize: '10'
                    }
                }
            }
        };
        return new Promise(resolve => {
            this.utility.post('/cust/customer', serviceRequest).then(items => {
                if (items['returncode'] === '000000') {
                    resolve(items);
                } else {
                    this.message.error('设备列表查询异常');
                }
            });
        });
    }
    handleOk() {
        console.log(this.deviceList);
        const workstation_codes = [];
        this.deviceList.forEach(item => {
            if (item.checked) {
                workstation_codes.push(item.value);
            }
        });
     
        for (const key in this.form) {
            // tslint:disable-next-line: max-line-length
            if (this.form.hasOwnProperty(key) && (this.form[key] === undefined || this.form[key] === null || this.form[key] === '' || workstation_codes.length === 0)) {
                this.message.error('请填写完整信息！');
                return;
            }
        }
        let serviceRequest: ServiceRequest;
        serviceRequest = {
            funccode: 'bind',
            svccode: 'TP550000',
            svctype: '0',
            requestdata: {
                bdy: {
                    'org_code': this.form.orgcode,
                    'rolecode': this.form.rolecode,
                    'org_name': 'x',
                    'emp_code': this.form.empcode,
                    'workstation_codes': workstation_codes
                },
                coh: {}
            }
        };
        console.log(this.form);

        this.utility.post('/cust/customer', serviceRequest).then(items => {
            if (items['returncode'] === '000000') {
                this.isVisible = false;
                this.message.success('提交成功');
            } else {
                this.message.error('提交失败');
            }
        });
    }

    queryOrg() {
        const serviceRequest = {
            svctype: '0',
            svccode: 'TX001',
            funccode: 'conditionQuery',
            requestdata: {
                bdy: {
                    tablename: 'btf_role_info',
                    page: '1',
                    pagesize: '999',
                    user_code: 'admin'
                },
                coh: {},
                ctl: {}
            }
        };
        this.bsaApi.asynCall(serviceRequest).subscribe(items => {
            console.log(items);
            if (items.returncode === '000000') {
                this.roleList = items['resultdata']['bdy']['data'].map(item => {
                    return { name: item.role_name, value: item.role_code };
                });
            }
        });
    }

    queryUser() {

        const serviceRequest = {
            'funccode': 'roleEmpList',
            'svccode': 'TP550000',
            'svctype': '0',
            'requestdata': {
                'bdy': {
                    'org_code': this.form.orgcode,
                    'role_code': this.form.rolecode,
                },
                'coh': {},
                'ctl': {}
            }
        };
        console.log(this.form.rolecode);

        this.utility.post('/cust/customer', serviceRequest).then((items: any) => {
            console.log(items);
            if (items.returncode === '000000') {
                this.userList = items['resultdata']['bdy']['data'].map(item => {
                    return { name: item.user_name, value: item.user_code };
                });

            }
        });
    }

    queryUserBydcs() {
        const serviceRequest = {
            'funccode': 'empWorkstationList',
            'svccode': 'TP550000',
            'svctype': '0',
            'requestdata': {
                'bdy': {
                    'emp_code': this.form.empcode
                },
                'coh': {},
                'ctl': {}
            }
        };
        console.log(this.form.rolecode);

        return new Promise((resolve, reject) => {
            this.utility.post('/cust/customer', serviceRequest).then((items: any) => {
                if (items.returncode === '000000') {
                    resolve(items['resultdata']['bdy']['data']);

                } else {
                    reject(items);
                }
            }, err => {
                reject(err);
            });
        });
    }

    // 重置方法
    reset($event) {

    }

    // 获取查询方法
    getQueryData($event) {
        console.log($event);
    }


    queryDevice() {
        const serviceRequest = {
            'svccode': 'TX001',
            'svctype': '0',
            'funccode': 'conditionQuery',
            'requestdata': {
                'coh': {},
                'bdy': {
                    'pagesize': '10',
                    'page': '1',
                    'params': [{
                        'logic': 'AND',
                        'queryList': [{
                            'logic': 'AND',
                            'operator': 'EQ',
                            'params': ['org_code', this.form.orgcode]
                        }]
                    }],
                    'tablename': 'btf_workstation'
                }
            }
        };
        this.queryUserBydcs().then((res: Array<[]>) => {
            this.bsaApi.asynCall(serviceRequest).subscribe(items => {
                if (items.returncode === '000000') {
                    items['resultdata']['bdy']['data'].forEach(y => {
                        res.forEach(x => {
                            y['checked'] = x['workstation_code'] === y.workstation_code ? true : false;
                        });
                    });
                    this.deviceList = items['resultdata']['bdy']['data'].map(item => {
                        return { label: item.workstation_name, value: item.workstation_code, checked: item.checked };

                    });
                    console.log(this.deviceList);

                }
            });
        });

    }
}
