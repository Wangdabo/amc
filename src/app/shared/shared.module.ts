import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
// 引入管道
import { TextoverflowPipe } from '../pipe/textoverflow.pipe';
import { IgnorePipe } from '../pipe/ignore.pipe';
import { TmsPlatformComponentModule } from 'tms-platform-component';
import { SafeurlPipe } from '../pipe/safeurl.pipe';
import {TransactionManage3Module} from "tms-platform";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
/*import {EditorModule} from 'primeng/editor';
import {FileUploadModule} from 'primeng/fileupload';*/
const PIPES = [
  IgnorePipe,
  TextoverflowPipe,
  SafeurlPipe
];

const SHAREDS = [
  CommonModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule,
  NgZorroAntdModule,
  NgxEchartsModule,
  TmsPlatformComponentModule,
  CKEditorModule
];

@NgModule({
  imports: [
    ...SHAREDS,
    TransactionManage3Module
  ],
  declarations: [
    ...PIPES
  ],
  exports: [
    ...SHAREDS,
    ...PIPES
  ],
})
export class SharedModule { }
