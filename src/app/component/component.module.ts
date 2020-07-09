import { NgModule } from '@angular/core';
import { SharedModule} from '../shared/shared.module';
import {SiderComponent} from './desktop/silder/sider.component';
// 组件
import { ThemeStyleComponent } from './desktop/theme-style/theme-style.component';
import { FixedtableComponent } from './desktop/fixedtable/fixedtable.component';
import { NewsilderComponent } from './desktop/newsilder/newsilder.component';
import { BmsilderComponent } from './desktop/bmsilder/bmsilder.component';
import { TitlebackComponent } from './desktop/titleback/titleback.component';


const COMPONENTS = [
  SiderComponent,
  ThemeStyleComponent,
  FixedtableComponent,
  NewsilderComponent,
  BmsilderComponent,
  TitlebackComponent
];
@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [  // 注册组件、指令、服务
    ...COMPONENTS
  ],
  exports: [ // 导出组件、指令、服务
    ...COMPONENTS
  ],
  schemas: []
})
export class ComponentModule { }
