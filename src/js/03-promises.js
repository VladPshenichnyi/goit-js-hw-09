import Notiflix from 'notiflix';

const form = document.querySelector('form')

form.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
    e.preventDefault()
    const { elements } = e.currentTarget;
    const { delay, step, amount } = elements;
    let promiseValue = {
    delayValue: Number(delay.value),
    stepValue: Number(step.value),
    amountValue: Number(amount.value)
    }
    let delayValue = promiseValue.delayValue;
    let stepValue = promiseValue.stepValue;
    let amountValue = promiseValue.amountValue;
    let position = null;
    for (let i = 0; i < amountValue; i++) {
    if ( i > 0 ) {
        delayValue += stepValue;
    }
    position += 1;
    
    createPromise(position, delayValue).then((position, delayValue) => {
        Notiflix.Notify.success(`✅ Fulfilled promise ${position}`);
    }).catch((position, delayValue) => {
        Notiflix.Notify.failure(`❌ Rejected promise ${position}`);
    });
    function createPromise(position, delayValue) {
        return new Promise((resolve, reject) => {
            const shouldResolve = Math.random() > 0.3;
            setTimeout(() => {
                if (shouldResolve) {
                    resolve(`${position} in ${delayValue}ms`)
                } else {
                    reject(`${position} in ${delayValue}ms`)
                }
            }, delayValue)
        };)
        };
    };
};