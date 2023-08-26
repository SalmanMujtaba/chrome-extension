let isError = false;
const signInCheckBox = document.getElementById('policy_confirmed');
if (signInCheckBox) {
  signInCheckBox.click();
}

// Groups Page.. continue button
const cont = document.getElementsByClassName('button primary small')[0];
if (cont) {
  cont.click();
}

// Rechedule Appointment
const ul = document.querySelectorAll('.accordion>.accordion-item');
const resc = ul[3];
if (resc) {
  let accordion = resc.children[1];
  accordion.children[0].children[1].children[1].children[0].click();
}

// Appointment drop down. Select location.
if(window.location.href && window.location.href.includes('appointment')) {
  let dropDown = document.getElementById('appointments_consulate_appointment_facility_id');
  if(dropDown) {
    for(let i=0;i<dropDown.children.length;i++) {
      if(dropDown.children[i]) {
        if(dropDown.children[i].textContent.trim().toLocaleLowerCase() === 'calgary') {
          dropDown.children[i].selected = true;
        } else {
          dropDown.children[i].selected = false;
        }
      }
    }
  }
  isError = document.getElementById('consulate_date_time_not_available').style.display === "block";
} 

if(!isError) {
}

const input = document.getElementById('appointments_consulate_appointment_date');
const datepicker = document.getElementsByClassName('ui-datepicker-group');
if (input) {
  // simulateClick(input);
  // input.click();
input.addEventListener('click', () => { console.log(); });
// console.log(document.getElementById('ui-datepicker-div'));
}



const yatri = document.getElementsByClassName('yatri_date')[0];
// console.log(yatri);
// yatri.click();

function simulateClick(input) {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
    screenX: 200,
    screenY: 200
  });
  const cb = input;
  const cancelled = !cb.dispatchEvent(event);

  if (cancelled) {
    // A handler called preventDefault.
    alert("cancelled");
  } else {
    // None of the handlers called preventDefault.
    alert("not cancelled");
  }
}