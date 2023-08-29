let isError = false;
let availableConsulateDays = [];
let locations = ['Toronto', 'Ottawa', 'Vancouver', 'Calgary']
let currentLocation = "";
let currentLocationSelectionElement = null;
let availableDateMap;
const isAppointmentPage =
  window.location.href && window.location.href.includes('appointment');
const isSignInPage = window.location.href.includes('https://ais.usvisa-info.com/en-ca/niv/users/sign_in');
const isContinuePage = window.location.href.includes('https://ais.usvisa-info.com/en-ca/niv/groups/36762461');
const isRechedulePage = window.location.href.includes('https://ais.usvisa-info.com/en-ca/niv/schedule/51484384/continue_actions');
const currentInverviewDate = '2025-07-29';
if (isAppointmentPage) {
  class CustomMap extends Map {
    set (key, value) {
      if (!this.has(key)) {
        // Execute your logic when a new value is added
        console.log(currentLocationSelectionElement);
        const currentLocation = locations.shift();
        // if (currentLocation) {
        //   dropDownSelection(currentLocation, currentLocationSelectionElement);
        //   setTimeout(() => processDatePickers(), 1000);
        // }
        console.log(`New value added: Key: ${key}, Value: ${value}`)
      }
      return super.set(key, value)
    }
  }
  availableDateMap = new CustomMap();
}

if (isSignInPage) {
  clickLoginCheckBox();
  signIn();
}
if (isContinuePage) {
  clickContinue()
}

if(isRechedulePage) {
  recheduleApt();
}

if(isAppointmentPage) {
  processLocations()
}

function signIn() {
  signInForm();
  const dialogButton = document.getElementsByClassName('ui-button ui-corner-all ui-widget')[0];
  if(dialogButton) {
    dialogButton.click();
  }
  setTimeout(() => {
    document.querySelector('input[type="submit"]').click();
  }, 2000);
}

function signInForm() {
  document.querySelector('input[type="email"]').value = 'xxx';
  document.querySelector('input[type="password"]').value = 'xxx';
}

function clickLoginCheckBox () {
  const signInCheckBox = document.getElementById('policy_confirmed')
  if (signInCheckBox) {
    signInCheckBox.click()
  }
}

// Groups Page.. continue button
function clickContinue () {
  const cont = document.getElementsByClassName('button primary small')[0]
  if (cont) {
    cont.click()
  }
}

// Rechedule Appointment
function recheduleApt () {
  const ul = document.querySelectorAll('.accordion>.accordion-item')
  const resc = ul[3]
  if (resc) {
    let accordion = resc.children[1];
    accordion.children[0].children[1].children[1].children[0].click();
  }
}

// Appointment drop down. Select location.
function processLocations () {
  // let form = document.getElementById('appointment-form');
  let dropDown = document.getElementById(
    'appointments_consulate_appointment_facility_id'
  );
  let dateTime = document.getElementById('consulate_date_time_not_available');
  let index = 0;
  isError = dateTime.style.display !== 'none';
  // availableConsulateDays = _this.availableConsulateDays;
  // console.log('Available consulate days: ', _this.availableConsulateDays);
  console.log("Do we see any error on the page ", isError);
  const inter = setInterval(() => {
    if (!isError || index === locations.length) {
      clearInterval(inter);
      processDatePickers();
      return
    } else if (index !== locations.length) {
      dropDownSelection(locations[index], Array.from(dropDown.children));
      currentLocation = locations[index];
      index++
    }
    isError = dateTime.style.display !== 'none';
    // console.log('Available consulate days II: ', _this.availableConsulateDays)
    // availableConsulateDays = _this.availableConsulateDays
  }, 1500)
}

function dropDownSelection (itemtoSelect, itemList) {
  console.log("What location are we trying to select: ", itemtoSelect.trim().toLocaleLowerCase());
  for (let i = 0; i < itemList.length; i++) {
    if (itemList[i]) {
      if (
        itemList[i].textContent.trim().toLocaleLowerCase() ===
        itemtoSelect.trim().toLocaleLowerCase()
      ) {
        itemList[i].selected = true;
        itemList[i].dispatchEvent(new Event('change', { bubbles: true }));
        if (!currentLocationSelectionElement) {
          currentLocationSelectionElement = itemList[i].parentElement;
        }
      } else {
        itemList[i].selected = false;
      }
    }
  }
}

const isDatePickerVisible = () => {
  const datePicker = document.getElementById('ui-datepicker-div');
  return !!datePicker.style.display && datePicker.style.display !== 'none';
}

function processDatePickers () {
  document.getElementById('appointments_consulate_appointment_date').value = "";
  clickDatePicker(() => {
    // When the datepicker is on the screen
    if (isDatePickerVisible()) {
      console.log('The datepicker is visible on the screen');
      clickNextAndFindDate();
    } else {
      console.log('The date picker is not available');
      logOut();
    }
  })
}

function clickNextAndFindDate () {
  // Programmatically click the next button
  const nextButton = document.querySelector('.ui-datepicker-next');
  if(!nextButton) {
    return; 
  }
  nextButton.click();

  // Wait for a brief moment to let the calendar update
  setTimeout(function () {
    // Find the available date from the updated calendar
    const availableDate = findAvailableDateFromCalendar();

    if (availableDate) {
      availableDate.click();
      const ad = document.getElementById('appointments_consulate_appointment_date').value;
      let isDateAvailable = compareDates(currentInverviewDate, ad);
      console.log(isDateAvailable, 'is date available', ad);
      if (isDateAvailable) {
        // Current location has a sooner date available
        selectTime();
      } else {
        // Current location does not have a sooner date!
        console.log(`A date was found at `);
        availableDateMap.set(currentLocation, ad);
      }
    } else {
      // If no available date found, click next and try again
      clickNextAndFindDate();
    }
  }, 500) // Adjust the delay as needed
}

function findAvailableDateFromCalendar () {
  // Select the calendar table
  const calendarTable = document.querySelector('.ui-datepicker-calendar');

  // Loop through the calendar rows and cells to find an available date
  const rows = calendarTable.getElementsByTagName('tr');
  for (let row of rows) {
    const cells = row.getElementsByTagName('td');
    for (let cell of cells) {
      // Check if the cell is selectable (not disabled)
      if (!cell.classList.contains('ui-datepicker-unselectable')) {
        // Extract the date value from the cell content
        // const date = cell.querySelector(".ui-state-default").textContent;
        return cell;
      }
    }
  }

  return null // No available date found
}

function clickDatePicker (callback) {
  console.log('There was no error found so the date can be selected');
  const input = document.getElementById(
    'appointments_consulate_appointment_date'
  ).nextSibling;
  if (input) {
    setTimeout(() => {
      input.click();
      callback();
    }, 1000)
  } else {
    logOut();
  }
}

function selectTime () {
  setTimeout(() => {
    // Get the time dropdown element
    const timeDropdown = document.getElementById(
      'appointments_consulate_appointment_time'
    );
    timeDropdown.options[1].selected = true;
    processInterviewSelection();
  }, 1000)
}

function processInterviewSelection () {
  const disabledButton = document.getElementById('appointments_submit');
  disabledButton.disabled = false;
  setTimeout(() => {
    document.getElementById('appointments_submit_action').click();
    const revealOverlay = document.querySelector('.reveal-overlay');
    if (revealOverlay && revealOverlay.style.display !== 'none') {
      const cancelButton = revealOverlay.querySelector('[data-confirm-cancel]');
      if (cancelButton) {
        cancelButton.click();
      }
    }
  }, 1000)
}

function compareDates (dateStr1, dateStr2) {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  if (date1 > date2) {
    console.log(`existing date is later than ${dateStr2}`);
    return true;
    // TODO: rechedule appointment here.
  } else {
    logOut();
    return false;
  }
}

const logOut = () => {
  // document.querySelector("a[href='/en-ca/niv/users/sign_out']").click();
};
// console.log(chrome, 'webrequest');
// Check if the chrome supports the webRequest API
// if (isAppointmentPage && chrome.webRequest && chrome.webRequest.onCompleted) {
//     // Add an event listener for completed requests
//   chrome.webRequest.onCompleted.addListener(
//     details => {
//       console.log('Request completed:', details.url)
//     },
//     { urls: ['<all_urls>'] } // Listen for all URLs
//   );
// }

