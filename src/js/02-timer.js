import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
    input: document.querySelector('#datetime-picker'),
    btn: document.querySelector('[data-start]'),
    clockFaceDays: document.querySelector('[data-days]'),
    clockFaceHours: document.querySelector('[data-hours]'),
    clockFaceMinutes: document.querySelector('[data-minutes]'),
    clockFaceSeconds: document.querySelector('[data-seconds]'),
};

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        // console.log(selectedDates[0]);
    },
};

const selectedDates = flatpickr('#datetime-picker', options);
let pickTime = null;
const timer = {
    intervalId: null,
    start() {
        if (Date.now() < pickTime) {
            this.intervalId = setInterval(() => {
                const currentTime = Date.now();
                const deltaTime = pickTime - currentTime;
                const time = convertMs(deltaTime);
                // console.log(`${days}:${hours}:${minutes}:${seconds}`);
                // convertMs(time);
                updateClockFace(time);
            }, 1000)
        }
        else { 
            Notiflix.Notify.failure('You cheat!')
        }
    },
    stop() { 
        clearInterval(this.intervalId);
    },
}

refs.input.addEventListener('input', checkTimer);
refs.btn.addEventListener('click', onTimerStart);
refs.btn.setAttribute('disabled', true);


function checkTimer() {
    pickTime = selectedDates.selectedDates[0].getTime();    
    if (Date.now() > pickTime) {
        Notiflix.Notify.failure('Please choose a date in the future');
        return;
    } else if (refs.btn.textContent === 'Stop') { 
        return;
    }
    refs.btn.classList.toggle('active')
    refs.btn.removeAttribute('disabled');
    Notiflix.Notify.success(`It’s just a little bit`) 
};

function onTimerStart() {    
    refs.btn.classList.toggle('active')
    if (refs.btn.textContent === 'Start') {
        refs.btn.textContent = 'Stop';
        timer.start()
        Notiflix.Notify.success('Hurry, time is short');
    }
    else if(refs.btn.textContent === 'Stop') {
        refs.btn.textContent = 'Start';
        timer.stop();
        Notiflix.Notify.warning('Okay, let’s wait');
}    
};

function updateClockFace({ days, hours, minutes, seconds }) { 
    refs.clockFaceDays.textContent = `${days}`;
    refs.clockFaceHours.textContent = `${hours}`;
    refs.clockFaceMinutes.textContent = `${minutes}`;
    refs.clockFaceSeconds.textContent = `${seconds}`;
};

function addLeadingZero(value) { 
    return String(value).padStart(2, '0');
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
};

// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}