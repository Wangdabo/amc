import { Injectable } from '@angular/core';
import { MarcActivitesComponent } from '../transaction-manage/trans/bm/marc-activites/marc-activites.component';

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  constructor() { }
  aiopsMneu = [
    {
      text: '首页',
      link: 'transaction/tx990239',
      icon: 'anticon anticon-home',
      code: 'home',
      src: './assets/newimage/leftbar/leftbar_icon_shouye_normal.png',
      children: [],
    },
    {
      text: '大数据洞察',
      link: '',
      icon: 'anticon anticon-bar-chart',
      src: './assets/newimage/leftbar/leftbar_icon_dashuju_normal.png',
      code: 'bigData',
      children: [
        {
          text: '网点画像',
          link: 'transaction',
          code: 'dotImage',
          icon: 'anticon anticon-gold',
          transCode: 'tx990507'
        },
        {
          text: '客群画像',
          link: 'transaction',
          code: 'customerImage',
          icon: 'anticon anticon-robot',
          transCode: 'tx990503'
        },
        {
          text: '员工信息中心',
          link: 'transaction',
          code: 'employeeInformation',
          icon: 'anticon anticon-robot',
          transCode: 'tx990531'
        }
      ]
    },
    {
      text: '智能分析',
      link: 'transaction',
      code: 'Insight',
      icon: 'anticon anticon-bar-chart',
      src: './assets/newimage/leftbar/leftbar_icon_zhineng_normal.png',
      children: [
        {
          text: '活跃度统计',
          link: 'transaction',
          code: 'activityStatistics',
          icon: 'anticon anticon-gold',
          transCode: 'tx990509'
        },
        {
          text: '热度分布',
          link: 'transaction',
          code: 'heatDistribution',
          icon: 'anticon anticon-radar-chart',
          transCode: 'tx990510'
        }, {
          text: '趋势分析',
          link: 'transaction',
          code: 'trendAnalysis',
          icon: 'anticon anticon-line-chart',
          transCode: 'tx990512'
        },
        {
          text: '交易行为分析',
          link: 'transaction',
          code: 'AnalysisofTransactionBehavior',
          icon: 'anticon anticon-heat-map',
          transCode: 'tx990527'
        }
      ]
    },
    {
      text: '实时监测',
      link: '',
      code: 'operationMonitoring',
      icon: 'anticon anticon-home',
      src: './assets/newimage/leftbar/leftbar_icon_jiankong_normal.png',
      children: [
        {
          text: '工作站监测',
          link: 'transaction',
          code: 'workstationMonitoring',
          icon: 'anticon anticon-gold',
          transCode: 'tx990520'
        }
      ]
    }
  ];

  govMneu = [
    {
      text: '导航页',
      link: 'transaction/tx990518',
      icon: 'anticon anticon-home',
      code: 'navPage',
      children: []
    },
    {
      text: '业务参数',
      link: '',
      icon: 'anticon anticon-dashboard',
      code: 'businessParameters',
      children: [
        {
          text: '业务字典',
          link: 'transaction',
          code: 'BusinessDict',
          icon: 'anticon anticon-exception',
          transCode: 'tx990391'
        },
        {
          text: '错误编码',
          link: 'transaction',
          code: 'errorCoding',
          icon: 'anticon anticon-close-square',
          transCode: 'tx990121'
        },
        {
          text: '业务标签',
          link: 'transaction',
          code: 'businessLabel',
          icon: 'anticon anticon-tags',
          transCode: 'tx990501'
        },
        {
          text: '交易工厂',
          link: 'transaction',
          code: 'tradingParameters',
          icon: 'anticon anticon-profile',
          transCode: 'tx990237'
        },
        {
          text: '交易行为',
          code: 'TransactionBehaviorManagement',
          link: 'transaction',
          icon: 'anticon anticon-profile',
          transCode: 'tx990526'
        }
      ]
    },
    {
      text: '组织机构',
      link: '',
      code: 'org',
      icon: 'anticon anticon-bank',
      children: [
        {
          text: '机构信息',
          link: 'transaction',
          code: 'orgInfo',
          icon: 'anticon anticon-fork',
          transCode: 'tx990211'
        },
        {
          text: '人员信息',
          link: 'transaction',
          code: 'personnelInfo',
          icon: 'anticon anticon-user',
          transCode: 'tx990351'
        },
        {
          text: '用户信息',
          link: 'transaction',
          code: 'userInfo',
          icon: 'anticon anticon-team',
          transCode: 'tx990371'
        }
      ]
    },
    {
      text: '渠道对象',
      link: '',
      code: 'channelObject',
      icon: 'anticon anticon-sliders',
      children: [
        {
          text: '渠道管理',
          link: 'transaction',
          code: 'channelManage',
          icon: 'anticon anticon-profile',
          transCode: 'tx990381'
        },
        {
          text: '终端管理',
          link: 'transaction',
          code: 'terminalManage',
          icon: 'anticon anticon-profile',
          transCode: 'tx990382'
        },
        {
          text: '外设管理',
          link: 'transaction',
          code: 'peripheralManage',
          icon: 'anticon anticon-api',
          transCode: 'tx990131'
        },
        {
          text: '外设套餐',
          link: 'transaction',
          code: 'peripheralPackage',
          icon: 'anticon anticon-build',
          transCode: 'tx990141'
        }
      ]
    },
    {
      text: '权限管理',
      link: '',
      code: 'authorityManage',
      icon: 'anticon anticon-file-done',
      children: [
        {
          text: '应用管理',
          link: 'transaction3',
          code: 'appManage',
          icon: 'anticon anticon-appstore',
          transCode: 'tx990300'
        },
        {
          text: '角色信息',
          link: 'transaction',
          code: 'roleInfo',
          icon: 'anticon anticon-usergroup-add',
          transCode: 'tx990301'
        },
        {
          text: '交易信息',
          link: 'transaction',
          code: 'TradingInfo',
          icon: 'anticon anticon-font-size',
          transCode: 'tx990231'
        },
        {
          text: '菜单信息',
          link: 'transaction',
          code: 'menuInfo',
          icon: 'anticon anticon-align-left',
          transCode: 'tx990341'
        },
        {
          text: '功能组信息',
          link: 'transaction',
          code: 'funcGroupInfo',
          icon: 'anticon anticon-pic-left',
          transCode: 'tx990281'
        }
      ]
    },
    {
      text: '系统参数',
      link: '',
      icon: 'anticon anticon-setting',
      code: 'systemParameters',
      children: [
        {
          text: '模拟服务管理',
          link: 'transaction',
          code: 'mockserviceManage',
          icon: 'anticon anticon-cluster',
          transCode: 'tx990151'
        },
        {
          text: '模拟报文管理',
          link: 'transaction',
          code: 'mockmessageManage',
          icon: 'anticon anticon-gold',
          transCode: 'tx990161'
        },
        {
          text: '区块链应用',
          link: 'transaction',
          code: 'blockchainApp',
          icon: 'anticon anticon-gateway',
          transCode: 'tx990401'
        },
       /* {
          text: 'H5模版管理',
          link: 'transaction',
          code: 'h5template',
          icon: 'anticon anticon-gold',
          transCode: 'tx001000'
        },*/
        /* {
          text: '黑名单查询1',
          link: 'transaction',
          code: 'blacklistQuery',
          icon: 'anticon anticon-gateway',
          transCode: 'tx990502'
        }, */ 
        {
          text: '服务器配置',
          link: 'transaction',
          code: 'serverConfig',
          icon: 'anticon anticon-cluster',
          transCode: 'tx990517'
        }, {
          text: '定时任务',
          link: 'transaction',
          code: 'timedTask',
          icon: 'anticon anticon-cluster',
          transCode: 'tx990241'
        },
      ]
    },
    {
      text: '知识库管理',
      link: '',
      icon: 'anticon anticon-read',
      code: 'knowledgBase',
      children: [
        {
          text: '知识库',
          link: 'transaction3',
          code: 'knowledg',
          icon: 'anticon anticon-reconciliation',
          transCode: 'tx990601'
        }
      ]
    },
    {
      text: '消息管理',
      link: '',
      icon: 'anticon anticon-message',
      code: 'messageManage',
      children: [
        {
          text: '消息通知',
          link: 'transaction3',
          code: 'message',
          icon: 'anticon anticon-bars',
          transCode: 'tx990606'
        }
      ]
    },
    {
      text: '智慧网点',
      link: '',
      icon: 'anticon anticon-message',
      code: 'wisdomnetwork',
      children: [
        {
          text: '重空阀值设置',
          link: 'transaction3',
          code: 'valve',
          icon: 'anticon anticon-bars',
          transCode: 'tx990608'
        },
        {
          text: '排队预警设置',
          link: 'transaction3',
          code: 'rowToSetting',
          icon: 'anticon anticon-bars',
          transCode: 'tx990609'
        },
        {
          text: '智慧柜员机异常吞卡预警',
          link: 'transaction3',
          code: 'retainCard',
          icon: 'anticon anticon-bars',
          transCode: 'tx990610'
        },
        {
          text: '排队管理',
          link: 'transaction3',
          code: 'queuemang',
          icon: 'anticon anticon-bars',
          transCode: 'tx990616'
        },
        {
            text: '网点管理',
            link: 'transaction3',
            code: 'dotmanage',
            icon: 'anticon anticon-bars',
            transCode: 'tx990619'
          },
        {
          text: '工作日志',
          link: 'transaction3',
          code: 'workdariy',
          icon: 'anticon anticon-bars',
          transCode: 'tx990610',
          children: [
            {
              text: '客户需求建议',
              link: 'transaction3',
              code: 'customdemand',
              icon: 'anticon anticon-bars',
              transCode: 'tx990615'
            },
            {
              text: '客户投诉',
              link: 'transaction3',
              code: 'customladge',
              icon: 'anticon anticon-bars',
              transCode: 'tx990611'
            },
            {
              text: '设施检查',
              link: 'transaction3',
              code: 'facrequest',
              icon: 'anticon anticon-bars',
              transCode: 'tx990612'
            },
            {
              text: '失物招领',
              link: 'transaction3',
              code: 'lostfind',
              icon: 'anticon anticon-bars',
              transCode: 'tx990613'
            },
            {
              text: '工作日志查询',
              link: 'transaction3',
              code: 'infofind',
              icon: 'anticon anticon-bars',
              transCode: 'tx990614'
            }
          ]
        }
      ]
    },
    {
      text: 'demo测试',
      link: '',
      code: 'demotest',
      icon: 'anticon anticon-home',
      children: [
        {
          text: '流水查询',
          link: 'transaction3',
          code: 'pipelineQuery',
          icon: 'anticon anticon-gold',
          transCode: 'tx339599'
        }
      ]
    }
  ];
  opsMenu = [
    {
      text: '首页',
      icon: 'anticon anticon-home',
      code: 'home',
      link: 'transaction/tx990530',
      children: [],
    },
    {
      text: '运维监控',
      link: 'transaction',
      code: 'operationMonitoring',
      icon: 'anticon anticon-pie-chart',
      children: [
        {
          text: '日志中心',
          link: 'transaction',
          code: 'logCenter',
          icon: 'anticon anticon-gold',
          transCode: 'tx990513'
        }, {
          text: '微服务监控',
          link: 'transaction',
          code: 'microserviceMonitoring',
          icon: 'anticon anticon-line-chart',
          transCode: 'tx990514'
        }, {
          text: '配置中心',
          link: 'transaction',
          code: 'registrationCenter',
          icon: 'anticon anticon-robot',
          transCode: 'tx990515'
        },
        {
          text: '监控中心',
          link: 'transaction',
          code: 'monitoringCenter',
          icon: 'anticon anticon-robot',
          transCode: 'tx990529'
        },{
          text: '链路追踪',
          link: 'transaction',
          code: 'linkTracking',
          icon: 'anticon anticon-cluster',
          transCode: 'tx990519'
        },
      ]
    },
     {
      text: '版本中心',
      link: '',
      code: 'versionCenter',
      icon: 'anticon anticon-home',
      children: [
        {
          text: '应用管理',
          link: 'transaction3',
          code: 'appManage',
          icon: 'anticon anticon-gold',
          transCode: 'tx991001'
        },
        {
          text: '客户端版本发布',
          link: 'transaction3',
          code: 'clientPublish',
          icon: 'anticon anticon-heat-map',
          transCode: 'tx991002'
        },
        {
          text: '服务端版本发布',
          link: 'transaction',
          code: 'serverPublish',
          icon: 'anticon anticon-heat-map',
          transCode: 'tx990516'
        }
      ]
    }
  ];

  // 调用方法
  menus(type) {
    console.log(type);
    if (type === 'aiops') {
      return this.aiopsMneu;
    } else if (type === 'gov') {
      return this.govMneu;
    } else if (type === 'ops') {
      return this.opsMenu;
    }
  }
}

/** 菜单类：待用 */
export interface Menu {
  [key: string]: any;
  /** 文本 */
  text: string;
  /** 路由 */
  link?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** 图标 */
  icon?: string;
  /** 二级菜单 */
  children?: Menu[];
}
