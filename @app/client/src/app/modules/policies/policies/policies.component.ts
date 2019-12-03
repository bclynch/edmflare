import { Component, OnInit } from '@angular/core';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {

  selectedTab = 0;

  constructor(
    private routerService: RouterService
  ) {
    this.selectedTab =  this.routerService.fragment === 'privacy' ? 1 : 0;
  }

  ngOnInit() {
  }

  changeTab(index: number) {
    this.routerService.modifyFragment(index === 1 ? 'privacy' : 'terms', '/policies');
  }

}
