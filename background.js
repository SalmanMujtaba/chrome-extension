let signInCheckBox = document.getElementById('policy_confirmed');
if (signInCheckBox) {
  signInCheckBox.click();
}

// Groups Page

const cont = document.getElementsByClassName('button primary small')[0];
if (cont) {
  cont.click();
}


const ul = document.querySelectorAll('.accordion>.accordion-item');
const resc = ul[3];
if (resc) {
  let accordion = resc.children[1];
  accordion.children[0].children[1].children[1].children[0].click();
}

const input = document.getElementById('appointments_consulate_appointment_date');
const datepicker = document.getElementsByClassName('ui-datepicker-group');
console.log(datepicker);
if (input) {
  // simulateClick(input);
  // input.click();
input.addEventListener('click', () => { console.log(); });
// console.log(document.getElementById('ui-datepicker-div'));
}



const yatri = document.getElementsByClassName('yatri_date')[0];
console.log(yatri);
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