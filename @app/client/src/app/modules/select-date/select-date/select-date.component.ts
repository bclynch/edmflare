import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss']
})
export class SelectDateComponent implements OnInit, OnChanges {
  @Input() placeholder = '';
  @Input() value: string;
  @Output() date: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('dateSelect', { static: true }) dateSelect;

  pickedDate: any = 'Pick a Date';
  dateOptions = [
    {
      label: 'Any Date',
      value: 'any'
    },
    {
      label: 'Today',
      value: 'today'
    },
    {
      label: 'Tomorrow',
      value: 'tomorrow'
    },
    {
      label: 'This Week',
      value: 'week'
    },
    {
      label: 'Next Week',
      value: 'nextWeek'
    },
    {
      label: 'This Month',
      value: 'month'
    },
    {
      label: 'Next Month',
      value: 'nextMonth'
    },
    {
      label: 'Pick a Date',
      value: 'pick'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(change) {
    if (change.value && change.value.currentValue && change.value.currentValue.includes('-')) {
      this.value = 'pick';
      this.pickedDate = moment(change.value.currentValue, 'DD-MM-YYYY');
    }
  }

  selection(value: string) {
    if (value !== 'pick') this.date.emit(value);
  }

  dateSelected() {
    if (this.pickedDate && this.pickedDate !== 'Pick a Date') {
      this.dateSelect.close();
      this.selection(moment(this.pickedDate).format('DD-MM-YYYY'));
    }
  }
}
