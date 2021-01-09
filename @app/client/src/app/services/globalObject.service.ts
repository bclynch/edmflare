import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class GlobalObjectService {
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  getWindow(): Window | null {
    return this.doc.defaultView;
  }

  getLocation(): Location {
    return this.doc.location;
  }

  createElement(tag: string): HTMLElement {
    return this.doc.createElement(tag);
  }
}
