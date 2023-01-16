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

const defaultColor = timerDataElements.daysEl.style.color;

//timer alorm sound
const audioUrl = new URL('../audio/alarm-sound.mp3', import.meta.url);
const alarmSound = new Audio(audioUrl);

//flatpickr options object
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
  stopInterval();
  clearValues();
  showValuesInColor(defaultColor);

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
  console.log(timeDifference);
  if (timeDifference.seconds === 0) {
    if (Object.values(timeDifference).join('') === '0000') {
      console.log('time has come');
      showTimeHasCome();
      stopInterval();
    }
  }
  showValues(timeDifference);
}

function showTimeHasCome() {
  showValuesInColor('red');
  Notify.failure('Time has come!');
  alarmSound.play();
  const alarmIntervalId = setInterval(() => {
    console.log('sound');
    alarmSound.play();
  }, 2000);
  setTimeout(() => clearInterval(alarmIntervalId), 10000);
}

//to change textContent of days/minutes/seconds timer elements
function showValues(timeDifference) {
  const { days, hours, minutes, seconds } = timeDifference;
  timerDataElements.daysEl.textContent = addLeadingZero(String(days));
  timerDataElements.hoursEl.textContent = addLeadingZero(String(hours));
  timerDataElements.minutesEl.textContent = addLeadingZero(String(minutes));
  timerDataElements.secondsEl.textContent = addLeadingZero(String(seconds));
}

//change element`s text color
function changeTextColor(el, color) {
  el.style.color = color;
}

function showValuesInColor(color) {
  Object.values(timerDataElements).forEach(element => {
    changeTextColor(element, color);
  });
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
