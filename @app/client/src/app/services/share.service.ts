import { Injectable } from '@angular/core';
import { DeviceService, DeviceType } from './device.service';
import { ShareDialogueComponent } from '../modules/share-dialogue/share-dialogue/share-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { Plugins } from '@capacitor/core';
const { Share } = Plugins;

@Injectable()
export class ShareService {

  constructor(
    private deviceService: DeviceService,
    public dialog: MatDialog
  ) {}

  share(data: { shareUrl: string; eventName: string; }) {
    this.deviceService.device === DeviceType.WEB
      ? this.shareWeb(data)
      : this.shareNative(data);
  }

  private shareWeb(data) {
    this.dialog.open(ShareDialogueComponent, {
      panelClass: 'sharedialog-panel',
      data
    });
  }

  private shareNative({ shareUrl, eventName }) {
    // TODO might be able to get better text info / an img / deep linking to app?
    Share.share({
      text: eventName,
      url: shareUrl,
    });
  }
}
