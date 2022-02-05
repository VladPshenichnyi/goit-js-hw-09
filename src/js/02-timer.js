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

let pickTime = null;

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

class Timer { 
    constructor({ onTick }) { 
        this.intervalId = null;
        this.onTick = onTick;
    }

    start() {
        if (Date.now() < pickTime) {
            this.intervalId = setInterval(() => {
                if (new Date(pickTime).toString() === new Date().toString()) {
                    clearInterval(this.intervalId);
                    refs.btn.textContent = 'Start';
                    refs.btn.setAttribute('disabled', true);
                    Notiflix.Report.success(
                        'All right, time`s up!',
                        'All right, let`s just try it again.',
                        'Okey',)
                }
                else {
                const currentTime = Date.now();
                const deltaTime = pickTime - currentTime;
                const time = this.convertMs(deltaTime);
                    
                this.onTick(time);                
                }
            }, 1000)
        }
        else  { 
            Notiflix.Notify.failure('You cheat!')
            return;
        }
    }

    stop() { 
        clearInterval(this.intervalId);
        // ********** Сбрасывает на 00 ******************
        // const time = this.convertMs(0);
        // this.onTick(time)
    }

    convertMs(ms) {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const days = this.addLeadingZero(Math.floor(ms / day));
        const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
        const minutes = this.addLeadingZero(Math.floor(((ms % day) % hour) / minute));
        const seconds = this.addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

        return { days, hours, minutes, seconds };
    }

    addLeadingZero(value) { 
    return String(value).padStart(2, '0');
    }

}
const timer = new Timer({
    onTick: updateClockFace
});

refs.input.addEventListener('input', checkTimer);
refs.btn.addEventListener('click', onTimerStart);
refs.btn.setAttribute('disabled', true);

function checkTimer() {
    pickTime = selectedDates.selectedDates[0].getTime();    
    if (Date.now() > pickTime) {
        timer.stop();
        refs.clockFaceDays.textContent = '00';
        refs.clockFaceHours.textContent = '00';
        refs.clockFaceMinutes.textContent = '00';
        refs.clockFaceSeconds.textContent = '00';
        // window.alert('Please choose a date in the future')
        Notiflix.Report.failure(
            'Error',
            'Please choose a date in the future',
            'Okay',
            );
        return;
    } else if (refs.btn.textContent === 'Stop') { 
        return;
    }
    refs.btn.classList.add('active')
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
    if (refs.clockFaceDays.value === '00' && refs.clockFaceHours.value === '00' &&
        refs.clockFaceMinutes.value === '00' && refs.clockFaceSeconds.value === '00') {
        timer.stop();
        refs.clockFaceDays.textContent = '00';
        refs.clockFaceHours.textContent = '00';
        refs.clockFaceMinutes.textContent = '00';
        refs.clockFaceSeconds.textContent = '00';
    }
    else { refs.clockFaceDays.textContent = `${days}`;
    refs.clockFaceHours.textContent = `${hours}`;
    refs.clockFaceMinutes.textContent = `${minutes}`;
    refs.clockFaceSeconds.textContent = `${seconds}`;}
    
};