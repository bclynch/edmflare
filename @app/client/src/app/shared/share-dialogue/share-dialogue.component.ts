import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShareService } from '@ngx-share/core';

@Component({
  selector: 'app-share-dialogue',
  templateUrl: './share-dialogue.component.html',
  styleUrls: ['./share-dialogue.component.scss']
})
export class ShareDialogueComponent implements OnInit {

  btns = ['facebook','twitter', 'reddit', 'whatsapp','messenger','telegram','sms','email'];

  constructor(
    public dialogRef: MatDialogRef<ShareDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { shareUrl: string },
    private snackBar: MatSnackBar,
    public share: ShareService
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.dialogRef.close();
  }

  copy() {
    this.copyToClipboard(this.data.shareUrl);
    this.snackBar.open('Link Copied', 'Close', {
      duration: 2000,
    });
  }

  copyToClipboard(item: string) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }
}
