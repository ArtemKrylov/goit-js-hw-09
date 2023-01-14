//datetime picker
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
//for custom non-blocking alerts/notifications
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const timerEl = document.querySelector('.timer');
const startBtnEl = timerEl.querySelector('[data-start]');
const timerDataElements = {
  daysEl: timerEl.querySelector('[data-days]'),
  hoursEl: timerEl.querySelector('[data-hours]'),
  minutesEl: timerEl.querySelector('[data-minutes]'),
  secondsEl: timerEl.querySelector('[data-seconds]'),
};

let selectedDate = null;
let timerIntervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
};
options.onClose = onClose;
flatpickr('#datetime-picker', options);

startBtnEl.addEventListener('click', onStartBtnElClick);

//disable start/stop timer button
function inactivateBtn() {
  startBtnEl.disabled = true;
}

//enable start/stop timer button
function activateBtn() {
  startBtnEl.disabled = false;
}

//callback function for flatpickr settings object - defines behaviour when date selection window is closed
function onClose(selectedDates) {
  // const startBtn = document.querySelector('[data-start]');
  // const dateNow = new Date();
  // const dateToCheck = new Date(selectedDates[0]);
  // if (dateToCheck - dateNow <= 0) {
  //   Notify.failure('Please choose a date in the future!');
  //   startBtn.disabled = true;
  //   return false;
  // }
  stopInterval();
  clearValues();

  if (!checkDate(selectedDates[0])) {
    Notify.failure('Please choose a date in the future!');
    inactivateBtn();
    return;
  }

  selectedDate = selectedDates[0];
  activateBtn();
}

function onStartBtnElClick() {
  if (!checkDate(selectedDate)) {
    Notify.failure('Please choose a date in the future!');
    inactivateBtn();
    return;
  }
  timerIntervalId = setInterval(countTimer, 1000);
  inactivateBtn();
}

function stopInterval() {
  clearInterval(timerIntervalId);
}

function checkDate(selectedDate) {
  if (!selectedDate) return;

  const dateNow = new Date();
  const dateToCheck = new Date(selectedDate);
  if (dateToCheck - dateNow <= 0) {
    return false;
  }
  return true;
}

//callback for timer setInterval
function countTimer() {
  const timeDifference = convertMs(selectedDate - new Date());
  showValues(timeDifference);
}

//to change textContent of days/minutes/seconds timer elements
function showValues(timeDifference) {
  const { days, hours, minutes, seconds } = timeDifference;
  timerDataElements.daysEl.textContent = addLeadingZero(String(days));
  timerDataElements.hoursEl.textContent = addLeadingZero(String(hours));
  timerDataElements.minutesEl.textContent = addLeadingZero(String(minutes));
  timerDataElements.secondsEl.textContent = addLeadingZero(String(seconds));
}

function clearValues() {
  showValues({ days: 0, hours: 0, minutes: 0, seconds: 0 });
}

function addLeadingZero(value) {
  return value.length < 2 ? value.padStart(2, '0') : value;
}

//convert miliseconds to { days, hours, minutes, seconds } object (and returns it)
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
