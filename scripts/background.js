let isError = false
let locations = ['Toronto', 'Ottawa', 'Vancouver', 'Calgary']
const currentInverviewDate = '2025-09-25'

clickLoginCheckBox()
clickContinue()
recheduleApt()
processLocations()

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
    let accordion = resc.children[1]
    accordion.children[0].children[1].children[1].children[0].click()
  }
}

// Appointment drop down. Select location.
function processLocations () {
  if (window.location.href && window.location.href.includes('appointment')) {
    // let form = document.getElementById('appointment-form');
    let dropDown = document.getElementById(
      'appointments_consulate_appointment_facility_id'
    )
    let dateTime = document.getElementById('consulate_date_time_not_available')
    let index = 0
    const inter = setInterval(() => {
      if (!isError || index === locations.length) {
        clearInterval(inter)
        processDatePickers()
        return
      } else if (index !== locations.length) {
        dropDownSelection(locations[index], Array.from(dropDown.children))
        index++
      }
      isError = dateTime.style.display !== 'none'
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
        itemList[i].selected = true
      } else {
        itemList[i].selected = false
      }
    }
  }
}

const isDatePickerVisible = () => {
  const datePicker = document.getElementById('ui-datepicker-div')
  return datePicker.style.display !== 'none'
}

function processDatePickers () {
  clickDatePicker(() => {
    // When the datepicker is on the screen
    if (isDatePickerVisible()) {
      clickNextAndFindDate()
    }
  })
}

function clickNextAndFindDate () {
  // Programmatically click the next button
  const nextButton = document.querySelector('.ui-datepicker-next')
  nextButton.click()

  // Wait for a brief moment to let the calendar update
  setTimeout(function () {
    // Find the available date from the updated calendar
    const availableDate = findAvailableDateFromCalendar()

    if (availableDate) {
      availableDate.click()
      selectTime()
    } else {
      // If no available date found, click next and try again
      clickNextAndFindDate()
    }
  }, 500) // Adjust the delay as needed
}

function findAvailableDateFromCalendar () {
  // Select the calendar table
  const calendarTable = document.querySelector('.ui-datepicker-calendar')

  // Loop through the calendar rows and cells to find an available date
  const rows = calendarTable.getElementsByTagName('tr')
  for (let row of rows) {
    const cells = row.getElementsByTagName('td')
    for (let cell of cells) {
      // Check if the cell is selectable (not disabled)
      if (!cell.classList.contains('ui-datepicker-unselectable')) {
        // Extract the date value from the cell content
        // const date = cell.querySelector(".ui-state-default").textContent;
        return cell
      }
    }
  }

  return null // No available date found
}

function clickDatePicker (callback) {
  console.log('There was no error found so the date can be selected')
  const input = document.getElementById(
    'appointments_consulate_appointment_date'
  ).nextSibling
  if (input) {
    setTimeout(() => {
      input.click()
      callback()
    }, 1000)
  }
}

function selectTime () {
  setTimeout(() => {
    // Get the time dropdown element
    const timeDropdown = document.getElementById(
      'appointments_consulate_appointment_time'
    )

    // Iterate through options to find a time >= 09:00
    for (let i = 0; i < timeDropdown.options.length; i++) {
      const option = timeDropdown.options[i]
      if (option.value >= '09:00') {
        option.selected = true
        processInterviewSelection()
        break
      }
    }
  }, 1000)
}

function processInterviewSelection () {
  const disabledButton = document.getElementById('appointments_submit')
  disabledButton.disabled = false
  setTimeout(() => {
    document.getElementById('appointments_submit_action').click()
    const revealOverlay = document.querySelector('.reveal-overlay')
    if (revealOverlay && revealOverlay.style.display !== 'none') {
      const cancelButton = revealOverlay.querySelector('[data-confirm-cancel]')
      if (cancelButton) {
        cancelButton.click()
      }
    }
  }, 1000)
}

function compareDates (dateStr1, dateStr2) {
  const date1 = new Date(dateStr1)
  const date2 = new Date(dateStr2)
  if (date1 > date2) {
    return `existing date is later than ${dateStr2}`
    // TODO: rechedule appointment here.
  } else if (date1 < date2) {
    return `existing date is earlier than ${dateStr2}`
  } else {
    return `existing date is equal to ${dateStr2}`
  }
}
