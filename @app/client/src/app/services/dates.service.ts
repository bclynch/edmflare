import { Injectable } from '@angular/core';
import startOfDay from 'date-fns/start_of_day';
import endOfDay from 'date-fns/end_of_day';
import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import startOfMonth from 'date-fns/start_of_month';
import endOfMonth from 'date-fns/end_of_month';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import addWeeks from 'date-fns/add_weeks';
import addMonths from 'date-fns/add_months';
import parse from 'date-fns/parse';

@Injectable()
export class DatesService {
  constructor() {}

  calculateDateRange(filter): { min: number, max: number } {
    const startDayValue = startOfDay(new Date()).valueOf();
    switch (filter) {
      case null:
      case 'any':
        // if this thing is alive and breaks in 2099 then fuck it why not
        return { min: startDayValue, max: 4102358400000 };
      case 'today':
        return { min: startDayValue, max: endOfDay(new Date()).valueOf() };
      case 'tomorrow':
        return { min: startOfDay(addDays(new Date(), 1)).valueOf(), max: endOfDay(addDays(new Date(), 1)).valueOf() };
      case 'week':
        return { min: startDayValue, max: endOfWeek(new Date()).valueOf() };
      case 'nextWeek':
        return { min: startOfWeek(addWeeks(new Date(), 1)).valueOf(), max: endOfWeek(addWeeks(new Date(), 1)).valueOf() };
      case 'month':
        return { min: startDayValue, max: endOfMonth(new Date()).valueOf() };
      case 'nextMonth':
        return { min: startOfMonth(addMonths(new Date(), 1)).valueOf(), max: endOfMonth(addMonths(new Date(), 1)).valueOf() };
      // if they select their own range
      default:
        return { min: parse(filter, 'dd-MM-yyyy', new Date()).valueOf(), max: endOfDay(parse(filter, 'dd-MM-yyyy', new Date())).valueOf() };
    }
  }

  // creating values for filter by create date for events. This is only for push notifications really
  calculateNewRange(filter): { min: number } {
    const today = new Date();
    const dayOfWeek = today.getDay();
    switch (filter) {
      case 'everyDay':
        // min is right now minus 24 hours in ms
        return { min: subDays(new Date(), 1).valueOf() };
      case 'threePerWeek':
        // want to send mon, thurs, and sat
        // so subtracting two days unless its thurs (4) in which case it's three
        return { min: subDays(new Date(), dayOfWeek === 4 ? 3 : 2).valueOf() };
      case 'twoPerWeek':
        // want to send mon, thurs
        // so subtracting three days from thurs (4) and four from mon
        return { min: subDays(new Date(), dayOfWeek === 4 ? 3 : 4).valueOf() };
      case 'onePerWeek':
        // subtract 7 days
        return { min: subDays(new Date(), 7).valueOf() };
      case 'everyTwoWeeks':
        // subtract 14 days
        return { min: subDays(new Date(), 14).valueOf() };
      default:
        // if there is no filter for this return everything
        return { min: 10 };
    }
  }
}
