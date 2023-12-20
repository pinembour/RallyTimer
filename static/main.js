// Open a WebSocket connection to the server
const socket = new WebSocket('ws://'+ location.host + '/ws/admin_changes/');

var data = {name: 'null', message: 'null'}
function ping() {
        socket.send('__ping__');
        tm = setTimeout(function () {
            location.reload();
    }, 5000);
}

function pong() {
    clearTimeout(tm);
}
socket.onopen = function () {
    setInterval(ping, 30000);
}

// Websocket event handlers
socket.onmessage = function (event) {
    // Handle socket messages here
    var msg = event.data;
    if (msg == '__pong__') {
        pong();
        return;
    }
    try {data = JSON.parse(msg)}
    catch {data = {name: 'noJSON', message: 'noJSON'}}
    console.log('Recieved message: ' + data.message);
    if (data.message == 'reload') {
        location.reload();
    }
};
socket.onclose = function(event) {
    // Handle socket closure here
    console.log('Socket closed with code: ' + event.code);
    location.reload();
};
socket.onerror = function(error) {
    // Handle any errors here
    console.error('Socket error: ' + error);
    location.reload();
};

const getTimezoneOffset = (timeZone, date = new Date()) => {
  // Get the timezone offset from local time in milliseconds
  const tz = date.toLocaleString("en", {timeZone, timeStyle: "long"}).split(" ").slice(-1)[0];
  const dateString = date.toString();
  const offset = Date.parse(`${dateString} UTC`) - Date.parse(`${dateString} ${tz}`);
  
  return offset;
}

// Get all elements whose IDs match the pattern 'service-box-X'
const serviceBoxes = document.querySelectorAll('[id^="service-box-"]')
// Get offset from server timezone
const offset = getTimezoneOffset(serverTimezone)

// Iterate over the timer date boxes
serviceBoxes.forEach(serviceBox => {
const suffix = serviceBox.id.split('-')[2] // Extract the suffix from the ID
    // Get the other elements we need to update for this timer from the HTML
    const remainingBox = document.getElementById(`remaining-box-${suffix}`)
    const remainingTitle = document.getElementById(`remaining-title-${suffix}`)
    const remainingText = document.getElementById(`remaining-text-${suffix}`)
    const disconnectBox = document.getElementById(`disconnect-box-${suffix}`)
    var untilLine
    try {
    untilLine = document.getElementById(`until-line-box-${suffix}`)
    }
    catch{
    console.log('No until line')    
    }
    const untilBox = document.getElementById(`until-box-${suffix}`)
    const untilTitle = document.getElementById(`until-title-box-${suffix}`)
    const countdownBox = document.getElementById(`timeleft-${suffix}`)
    const localtimeBox = document.getElementById(`local-time`)
    const timerDate = Date.parse(timer_date[suffix])

    // Convert time strings to milliseconds
    const timeToRedSplit = time_to_red[suffix].split(':')
    const timeToRed = (+timeToRedSplit[0] * 60 * 1000) + ((+timeToRedSplit[1] * 1000) || 0)
    const timeToYellowSplit = time_to_yellow[suffix].split(':')
    const timeToYellow = (+timeToYellowSplit[0] * 60 * 1000) + ((+timeToYellowSplit[1] * 1000) || 0)
    const timerDurationSplit = timer_duration[suffix].split(':')
    const timerDuration = (+timerDurationSplit[0] * 60 * 60 * 1000) + (+timerDurationSplit[1] * 60 * 1000) + ((+timerDurationSplit[2] * 1000) || 0)
    // Store the timer duration in hours, minutes, seconds
    const timerDurationHours = Math.floor(timerDuration / (1000 * 60 * 60))
    const timerDurationMinutes = Math.floor((timerDuration % (1000 * 60 * 60)) / (1000 * 60))
    const timerDurationSeconds = Math.floor((timerDuration % (1000 * 60)) / 1000)

    // Update every second
    const myCountdown = setInterval(() => {
        // Get the current time
        const now = new Date().getTime()

        // Calculate how much time is left on the timer, and store it as hours, minutes, seconds
        const diff = timerDate - now + timerDuration
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        const until = timerDate - now
        const untilHours = Math.floor((until % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const untilMinutes = Math.floor((until % (1000 * 60 * 60)) / (1000 * 60))
        const untilSeconds = Math.floor((until % (1000 * 60)) / 1000)

        // Display the localtime according to the server timezone in the format HH:MM:SS
        var formattedTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, minute:'numeric', second: 'numeric', timeZone: serverTimezone }).format(now)
        localtimeBox.innerHTML = formattedTime

        if (paused[suffix]) {
            // Display 'Service paused'
            disconnectBox.style.display = 'none'
            countdownBox.innerHTML = 'Service paused'
            remainingBox.style.display = 'revert'
        } else if (is_tfz[suffix]) {
            // Display 'TFZ'
            disconnectBox.style.display = 'none'
            remainingTitle.innerHTML = ''
            remainingText.innerHTML = 'Tire Fitting Zone'
            remainingBox.style.display = 'revert'
        } else {
            remainingBox.style.display = 'none'
            disconnectBox.style.display = 'revert'
        }
        if (data.name == suffix) {
            timer_disconnect[suffix] = (data.message.toLowerCase() === 'true')
        }
        if (timer_disconnect[suffix]) {
            document.getElementById(`disconnectId-${suffix}`).src = "/static/canDisconnect.svg"
        } else {
            document.getElementById(`disconnectId-${suffix}`).src = "/static/cannotDisconnect.svg"
        }       

        // If time left is more than -30 minutes
        if (diff > -30*1000*60) {
            // If time left is less than timeToRed
            if (diff <= timeToRed) {
                //If on the home page
                if (location.pathname == "/") {
                    // Change the color of the timer text to red
                    countdownBox.classList.remove('text-warning')
                    countdownBox.classList.add('text-danger')
                } else {
                    // Change the background color to red
                    document.getElementById("title").classList.add('text-light')
                    document.getElementById("background").classList.remove('bg-light')
                    document.getElementById("background").classList.remove('bg-warning')
                    document.getElementById("background").classList.add('bg-gradient')
                    document.getElementById("background").classList.add('bg-danger')
                }
                countdownBox.innerHTML = hours.toString().padStart(2,'0') + ':' + minutes.toString().padStart(2,'0') + ':' + seconds.toString().padStart(2,'0')
                // If time left is less than 0
                if ( diff <= 0 ) {
                    // Compensate for timer going in negatives
                    countdownBox.innerHTML = '-' + Math.abs(hours+1).toString().padStart(2,'0') + ':' + Math.abs(minutes+1).toString().padStart(2,'0') + ':' + Math.abs(seconds+1).toString().padStart(2,'0')
                }
            // If time left is less than timeToYellow
            } else if (diff <= timeToYellow) {
                // If on the home page
                if (location.pathname == "/") {
                    // Change the color of the timer text to yellow
                    countdownBox.classList.add('text-warning')
                }
                else {
                    // Change the background color to yellow
                    document.getElementById("background").classList.remove('bg-light')
                    document.getElementById("background").classList.remove('bg-danger')
                    document.getElementById("background").classList.add('bg-warning')
                    document.getElementById("background").classList.add('bg-gradient')
                }
                countdownBox.innerHTML = hours.toString().padStart(2,'0') + ':' + minutes.toString().padStart(2,'0') + ':' + seconds.toString().padStart(2,'0')
            // If time left is more than timerDuration
            } else if (diff > timerDuration){
                // Display the timer duration
                countdownBox.innerHTML = timerDurationHours.toString().padStart(2,'0') + ':' + timerDurationMinutes.toString().padStart(2,'0') + ':' + timerDurationSeconds.toString().padStart(2,'0')
                untilBox.style.display = 'revert'
                untilTitle.style.display = 'revert'
                try {
                    //Detailed view only
                    untilLine.style.display = 'revert'
                } catch {
                    //Base view only
                    disconnectBox.style.display = 'none'
                }
                untilBox.innerHTML = untilHours.toString().padStart(2,'0') + ':' + untilMinutes.toString().padStart(2,'0') + ':' + untilSeconds.toString().padStart(2,'0')
            } else {
                // Display the time left
                untilTitle.style.display = 'none'
                untilBox.style.display = 'none'
                try {
                    //Detailed view only
                    untilLine.style.display = 'none'
                } catch {
                }
                countdownBox.innerHTML = hours.toString().padStart(2,'0') + ':' + minutes.toString().padStart(2,'0') + ':' + seconds.toString().padStart(2,'0')
            }
        } else {
            // Display 'Service completed' and change the colors back
            if (!paused[suffix]){
                if (is_tfz[suffix]) {
                    countdownBox.innerHTML = 'TFZ completed'
                } else {
                    countdownBox.innerHTML = 'Service completed'
                }
            }
            countdownBox.classList.remove('text-warning')
            countdownBox.classList.remove('text-danger')
            try{
            document.getElementById("title").classList.remove('text-light')
            document.getElementById("background").classList.remove('bg-error')
            document.getElementById("background").classList.add('bg-light')
            document.getElementById("background").classList.remove('bg-gradient')
            }
            catch{//In base view there is no disconnect box
            }
        }
    }, 1000)
})