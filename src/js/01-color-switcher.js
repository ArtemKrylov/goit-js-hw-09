const startBtnEl = document.querySelector('[data-start]');
const stopBtnEl = document.querySelector('[data-stop]');
const bodyEl = document.querySelector('body');
let switcherIntervalId = null;

startBtnEl.addEventListener('click', onStartBtnElClick);
stopBtnEl.addEventListener('click', onStopBtnElClick);

function onStartBtnElClick() {
  switcherIntervalId = setInterval(
    () => changeBackgroundColor(bodyEl, getRandomHexColor()),
    1000
  );
  disableBtn(startBtnEl);
  activateBtn(stopBtnEl);
}

function onStopBtnElClick() {
  disableBtn(stopBtnEl);
  activateBtn(startBtnEl);
  clearInterval(switcherIntervalId);
}

function changeBackgroundColor(element, color) {
  element.style.backgroundColor = color;
  element.style.backgroundImage = 'none';
}

function disableBtn(element) {
  element.disabled = true;
}

function activateBtn(element) {
  element.disabled = false;
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
