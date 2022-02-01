const refs = {
    body: document.querySelector('body'),
    startBtn: document.querySelector('[data-start]'),
    stopBtn: document.querySelector('[data-stop]')
};

let timerBgColorId = null;

refs.startBtn.addEventListener('click', onClickStartBtn);
refs.stopBtn.addEventListener('click', onClickStopBtn);
refs.stopBtn.setAttribute('disabled', true);

function getRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

function onClickStartBtn() {
    timerBgColorId = setInterval(() => {
        refs.body.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }, 1000);
    refs.startBtn.setAttribute('disabled', true)
    refs.stopBtn.removeAttribute('disabled');
};

function onClickStopBtn() {
    clearInterval(timerBgColorId);
    refs.startBtn.removeAttribute('disabled')
    refs.stopBtn.setAttribute('disabled', true);
};  