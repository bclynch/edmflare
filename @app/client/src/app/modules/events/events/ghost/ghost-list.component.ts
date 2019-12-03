import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ghost-list',
  template: `
    <div class="cardContainer ghost_item" *ngFor="let it of ghosts">
      <div class="imageWrapper"></div>
      <div class="eventInfo lines">
        <h3 class="eventName ghostLine"></h3>
        <div class="eventDate ghostLine"></div>
        <div class="eventLocation ghostLine"></div>
        <div class="eventOptions">
          <button class="ghostLine"></button>
          <button class="ghostLine"></button>
          <button class="ghostLine"></button>
          <button class="ghostLine"></button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./ghost-list.component.scss']
})
export class GhostListComponent {
  @Input() ghosts: any[];
}
