import {
  Component, ComponentFactoryResolver, ComponentRef, Input, OnChanges, OnDestroy, OnInit, ReflectiveInjector, SimpleChanges, ViewChild,
  ViewContainerRef
} from '@angular/core';
// 动态加载组件，必须要先在这里面注册，才能动态加载
import {Observable} from 'rxjs';
import {TRANS_MAIN} from '../../trans/dynamic-trans-registe';

const entryComponents = TRANS_MAIN;
@Component({
  selector: 'app-dynamic-transaction',
  entryComponents: entryComponents,  // 需要动态加载的组件名，这里一定要指定，否则报错
  template: '<ng-template #container></ng-template>'
})
export class DynamicTransactionComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('container', { read: ViewContainerRef,  static: true }) container: ViewContainerRef;
  @Input() componentName;     // 需要加载的组件名
  @Input() inputs: any;        // 加载组件需要传入的参数组
  @Input() outputlisteners: {[key: string]: {handler: Function, caller: string}};        // 加载组件需要传入的参数组
  @Input() reload$: Observable<any>;        // 加载组件需要传入的参数组
  compRef: ComponentRef<any>; //  加载的组件实例
  constructor(private resolver: ComponentFactoryResolver) {}
  loadComponent() {
    if (this.compRef) {
      this.compRef.destroy();
    }
    const component = this.resolver.resolveComponentFactory(this.componentName);
    this.compRef = this.container.createComponent(component);
    Object.keys(this.inputs).forEach((inputName) => {
      const find = component.inputs.find(value => {
        return value.propName === inputName;
      } );
      if (find) {
        this.compRef.instance[inputName] = this.inputs[inputName];
      }
    });
    Object.keys(this.outputlisteners).forEach((outputlistenerName) => {
      const find = component.outputs.find(value => {
        return value.propName === outputlistenerName;
      } );
      if (find) {
        this.compRef.instance[outputlistenerName].subscribe(event => {
          this.outputlisteners[outputlistenerName].handler.call(this.outputlisteners[outputlistenerName].caller, event);
        });
      }
    });
  }

  ngOnInit(): void {
    if (this.reload$) {
      this.reload$.subscribe(data => {
        this.loadComponent();
      });
    }
    this.loadComponent();
  }
  ngOnDestroy() {
    if (this.compRef) {
      this.compRef.destroy();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.loadComponent();
  }
}
