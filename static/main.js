console.log('Hello world')

const timerDateBox = document.getElementById('timer-date-box')
const timerDurationBox = document.getElementById('timer-duration-box')
const countdownBox = document.getElementById('timeleft')

const timerDate = Date.parse(timerDateBox.textContent)
const timerDurationSplit = timerDurationBox.textContent.split(':')
const timerDuration = (+timerDurationSplit[0] * 60 * 60 * 1000) + (+timerDurationSplit[1] * 60 * 1000) + ((+timerDurationSplit[2] * 1000) || 0)
const myCountdown = setInterval(() => {
    const now = new Date().getTime()

    const diff = timerDate - now + timerDuration

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    if (diff > -30*1000*60) {
        if (diff < 0) {
            countdownBox.style.color = 'red'
            countdownBox.innerHTML = Math.abs(hours+1) + 'h ' + Math.abs(minutes+1) + 'm ' + Math.abs(seconds+1) + 's '
        } else {
            countdownBox.innerHTML = hours + 'h ' + minutes + 'm ' + seconds + 's '
        }
    } else {
        clearInterval(myCountdown)
        countdownBox.innerHTML = 'Service compleed'
    }
}, 1000)
