import { Notify } from 'notiflix/build/notiflix-notify-aio';

let promiseSetup = {
  delay: null,
  step: null,
  amount: null,
};
const promiseForm = document.querySelector('.form');

//set inputs` values from localStorage
setInputsFromLocalStorage();

promiseForm.addEventListener('change', onPromiseFormInputChange);
promiseForm.addEventListener('submit', onPromiseFormBtnSubmit);

function onPromiseFormInputChange({ target }) {
  promiseSetup[target.name] = parseInt(target.value);
  writeToLocalStorage(promiseSetup);
}

function onPromiseFormBtnSubmit(event) {
  event.preventDefault();
  if (!checkInputs()) {
    Notify.failure('Enter all inputs correctly!');
    return;
  }
  removeAllRedOutlines();
  clearLocalStorage();
  clearInputFields();
  //set notify messages` timeout so they don`t hide while all Promises are resolved/rejected
  //timeout can`t be less than 5 seconds
  let timeout = promiseSetup.amount * promiseSetup.step + promiseSetup.delay;
  timeout = timeout < 5000 ? 5000 : timeout;
  Notify.init({
    timeout: timeout,
  });

  for (let i = 0; i < promiseSetup.amount; ++i) {
    const delay = promiseSetup.delay + promiseSetup.step * i;
    createPromise(i + 1, delay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });
  }
}

//writes data from inputs to localStorage
function writeToLocalStorage(obj) {
  try {
    localStorage.setItem('promiseSetup', JSON.stringify(obj));
  } catch (error) {
    console.error(error);
  }
}

function clearLocalStorage() {
  localStorage.removeItem('promiseSetup');
}

function clearInputFields() {
  promiseForm.reset();
}

//reads data from localStorage and updates promiseSetup obj
function setInputsFromLocalStorage() {
  if (!promiseSetup || Object.keys(promiseSetup).length === 0) return;

  let promiseSetupParsed;
  try {
    promiseSetupParsed = JSON.parse(localStorage.getItem('promiseSetup'));
  } catch (error) {
    console.error(error);
    return;
  }
  promiseSetup = promiseSetupParsed ? promiseSetupParsed : promiseSetup;

  Object.keys(promiseSetup).forEach(
    key => (promiseForm.elements[key].value = promiseSetup[key])
  );
}

//checks if all inputs are made and all are correct (digits above zero)
function checkInputs() {
  let passed = true;
  Object.keys(promiseSetup).forEach(key => {
    if (!Boolean(promiseSetup[key]) || promiseSetup[key] < 0) {
      showWrongInput(key);
      passed = false;
    }
  });

  return passed;
}

//adds red outline to wrong input field
function showWrongInput(inputName) {
  promiseForm[inputName].style.outline = '1px solid red';
}

//removes all red outlines from input fields
function removeAllRedOutlines() {
  [...promiseForm.elements].forEach(el => {
    if (el.nodeName === 'INPUT') {
      el.style.outline = 'none';
    }
  });
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    if (shouldResolve) {
      // Fulfill
      console.log('true ', { position, delay });
      setTimeout(() => resolve({ position, delay }), delay);
    } else {
      // Reject
      console.log('false ', { position, delay });
      setTimeout(() => reject({ position, delay }), delay);
    }
  });
}
