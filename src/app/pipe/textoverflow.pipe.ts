import { Pipe, PipeTransform } from '@angular/core';

// 文字省略管道, 超过两个字符变成三个点
@Pipe({
  name: 'textoverflow'
})

export class TextoverflowPipe implements PipeTransform {

  transform(value: any, args: number): any {
    if (value) {
      if (value.length <= args) {
        return value;
      }

      value = value.substr(0, args);
      return value + ( '...');
    }
  }

}
