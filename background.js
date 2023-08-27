let isError = false;
let locations = ['Toronto', 'Ottawa', 'Vancouver', 'Calgary'];


clickLoginCheckBox();
clickContinue();
recheduleApt();
processLocations();

function clickLoginCheckBox() {
  const signInCheckBox = document.getElementById('policy_confirmed');
  if(signInCheckBox) {
    signInCheckBox.click();
  }
}

// Groups Page.. continue button
function clickContinue() {
  const cont = document.getElementsByClassName('button primary small')[0];
  if(cont) {
    cont.click();
  }
}

// Rechedule Appointment
function recheduleApt() {
  const ul = document.querySelectorAll('.accordion>.accordion-item');
  const resc = ul[3];
  if(resc) {
    let accordion = resc.children[1];
    accordion.children[0].children[1].children[1].children[0].click();
  }
}

// Appointment drop down. Select location.
function processLocations() {
  if(window.location.href && window.location.href.includes('appointment')) {
    // let form = document.getElementById('appointment-form');
    let dropDown = document.getElementById('appointments_consulate_appointment_facility_id');
    let isError = !!document.getElementById('consulate_date_time_not_available');
    let index = 0;
    const inter = setInterval(() => {
      if(index !== locations.length) {
        dropDownSelection(locations[index], Array.from(dropDown.children));
        index++;
        console.log(isError)
      } else if(!isError || index === locations.length){
        clearInterval(inter);
      }
    }, 1500);
  }
}

function dropDownSelection(itemtoSelect, itemList) {
  for(let i=0;i<itemList.length;i++) {
    if(itemList[i]) {
      if(itemList[i].textContent.trim().toLocaleLowerCase() === itemtoSelect.trim().toLocaleLowerCase()) {
        itemList[i].selected = true;
      } else {
        itemList[i].selected = false;
      }
    }
  }
}

function selectDate() {
  const datePicker = document.querySelectorAll("td");
  if(datePicker && datePicker.length) {
    for(let td of Array.from(datePicker)) {
      if(td.classList && Array.from(td.classList).includes('ui-state-disabled')) {
        console.log('disabled', td);
        continue;
      } else {
        console.log(td);
        return true;
      }
    }
  }
  return false;
}

function chooseLocation() {
  console.log("There was no error found so the date can be selected");
  const input = document.getElementById('appointments_consulate_appointment_date').nextSibling;
  console.log(input);
  if (input) {
    setTimeout(()=> {
      input.click();
      const next = document.getElementsByClassName('ui-datepicker-next ')[0];
      console.log(next);
      let count = 3;
      setTimeout(()=>{
        while(!selectDate() && count>=0) {
          next.click();
          count--;
        }
      }, 1000);
    }, 1000);
  }
}