import { Component, Input } from '@angular/core';
import { DeviceService, DeviceType } from '../../../services/device.service';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-pagewrapper',
  templateUrl: './pagewrapper.component.html',
  styleUrls: ['./pagewrapper.component.scss']
})
export class PagewrapperComponent {
  @Input() displayNavLogo = true;
  @Input() displayFooter = true;
  @Input() displayNav = true;
  @Input() collapsibleNav = true;
  @Input() hasBack = true;
  @Input() noMargin = false;

  isWeb;

  constructor(
    private utilService: UtilService,
    private deviceService: DeviceService
  ) {
    // want nav always there on page init to start
    this.utilService.scrollDirection = 'up';
    this.isWeb = this.deviceService.device === DeviceType.WEB;
  }

}
