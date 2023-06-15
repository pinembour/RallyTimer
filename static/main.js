const socket = new WebSocket('ws://'+ location.host + '/ws/admin_changes/');
socket.onmessage = function (event) {
    console.log('Recieved message: ' + event.data);
    location.reload();
};
socket.onclose = function(event) {
    // Handle socket closure here
    console.log('Socket closed with code: ' + event.code);
};

socket.onerror = function(error) {
    // Handle any errors here
    console.error('Socket error: ' + error);
};

// Get all elements whose IDs match the pattern 'timer-date-box-X'
const timerDateBoxes = document.querySelectorAll('[id^="timer-date-box-"]')

// Iterate over the timer date boxes
timerDateBoxes.forEach(timerDateBox => {
const suffix = timerDateBox.id.split('-')[3] // Extract the suffix from the ID

    const timerDurationBox = document.getElementById(`timer-duration-box-${suffix}`)
    const countdownBox = document.getElementById(`timeleft-${suffix}`)

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
            countdownBox.innerHTML = 'Service completed'
        }
    }, 1000)
})