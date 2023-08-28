let isError = false
let locations = ['Toronto', 'Ottawa', 'Vancouver', 'Calgary']
let currentLocation = "";
let currentLocationElement = null;
let availableDateMap;
const currentInverviewDate = '2025-09-25'
if (window.location.href && window.location.href.includes('appointment')) {
  class CustomMap extends Map {
    set (key, value) {
      if (!this.has(key)) {
        // Execute your logic when a new value is added
        console.log(currentLocationElement);
        console.log(`New value added: Key: ${key}, Value: ${value}`)
      }
      return super.set(key, value)
    }
  }
  availableDateMap = new CustomMap();
}

clickLoginCheckBox();
signIn();
clickContinue();
recheduleApt();
processLocations();

function signIn() {
  if(window.location.href.includes('https://ais.usvisa-info.com/en-ca/niv/users/sign_in')) {
    signInForm();
    const dialogButton = document.getElementsByClassName('ui-button ui-corner-all ui-widget')[0];
    if(dialogButton) {
      dialogButton.click();
    }
    setTimeout(() => {
      document.querySelector('input[type="submit"]').click();
      console.log('Did I click something??');
    }, 2000);
  }
}

function signInForm() {

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
  if (window.location.href && window.location.href.includes('appointment')) {
    // let form = document.getElementById('appointment-form');
    let dropDown = document.getElementById(
      'appointments_consulate_appointment_facility_id'
    );
    let dateTime = document.getElementById('consulate_date_time_not_available');
    let index = 0;
    isError = dateTime.style.display !== 'none'
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
    }, 1500)
  }
}

function dropDownSelection (itemtoSelect, itemList) {
  for (let i = 0; i < itemList.length; i++) {
    if (itemList[i]) {
      if (
        itemList[i].textContent.trim().toLocaleLowerCase() ===
        itemtoSelect.trim().toLocaleLowerCase()
      ) {
        itemList[i].selected = true;
        currentLocationElement = itemList[i];
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
      availableDateMap.set(currentLocation, ad);
      console.log(isDateAvailable, 'is date available', ad);
      if(isDateAvailable) {
        selectTime();
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
    timeDropdown.options[0].selected = true;
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

