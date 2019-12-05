export default function frequency() {
  // list of frequencies we want to include for this push notification blast
  // obviously every day would be included as it's sent only once a day and is hard coded on sql statement below
  const frequencyArray = [];

  // identiy which frequencies need to have a notifcation sent to
  // day index starts sundays as 0
  // Most all notifcations sent on mondays
  // many sent on thurs
  const currentDay = new Date().getDay();
  switch(currentDay) {
    case 1:
      // if it's monday
      frequencyArray.push('Three times a week');
      frequencyArray.push('Two times a week');
      frequencyArray.push('Once a week');
      frequencyArray.push('Once every two weeks');
      break;
    case 4:
      // if it's thursday
      frequencyArray.push('Three times a week');
      frequencyArray.push('Two times a week');
      break;
    case 6:
      // if it's saturday
      frequencyArray.push('Three times a week');
      break;
  }

  return frequencyArray;
}
