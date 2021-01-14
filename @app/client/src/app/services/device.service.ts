import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

export enum DeviceType {
  ANDROID = 'android',
  WEB = 'web',
  IOS = 'ios'
}

@Injectable()
export class DeviceService {
  device: DeviceType;

  constructor() {
    // @ts-ignore
    this.device = Capacitor.platform;
  }

}
