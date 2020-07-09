import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  public modal: any;
  constructor() {
    this.modal = {
      large: '1024',
      mid: '800',
      small: '600'
    };
  }
}

