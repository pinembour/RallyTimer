// Open a WebSocket connection to the server
const socket = new WebSocket('ws://'+ location.host + '/ws/admin_changes/');

// Websocket event handlers
socket.onmessage = function (event) {
    // Handle socket messages here
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
    const countdownBox = document.getElementById(`timeleft-${suffix}`)
    const localtimeBox = document.getElementById(`local-time`)
    const timerDate = Date.parse(timer_date[suffix])

    // Convert time strings to milliseconds
    const timeToRedSplit = time_to_red[suffix].split(':')
    const timeToRed = (+timeToRedSplit[0] * 60 * 1000) + ((+timeToRedSplit[1] * 1000) || 0)
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

        // Display the localtime according to the server timezone in the format HH:MM:SS
        var formattedTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, minute:'numeric', second: 'numeric', timeZone: serverTimezone }).format(now)
        localtimeBox.innerHTML = formattedTime

        if (paused[suffix]) {
            // Display 'Service paused'
            countdownBox.innerHTML = 'Service paused'
            remainingBox.style.visibility = 'visible'
        } else {
        remainingBox.style.visibility = 'hidden'

        // If time left is less than 30 minutes
        if (diff > -30*1000*60) {
            // If time left is less than timeToRed
            if (diff <= timeToRed) {
                // Display the time left in red
                countdownBox.style.color = 'red'
                countdownBox.innerHTML = hours.toString().padStart(2,'0') + ':' + minutes.toString().padStart(2,'0') + ':' + seconds.toString().padStart(2,'0')
                // If time left is less than 0
                if ( diff <= 0 ) {
                    // Compensate for timer going in negatives
                    countdownBox.innerHTML = '-' + Math.abs(hours+1).toString().padStart(2,'0') + ':' + Math.abs(minutes+1).toString().padStart(2,'0') + ':' + Math.abs(seconds+1).toString().padStart(2,'0')
                }
            // If time left is more than timerDuration
            } else if (diff > timerDuration){
                // Display the timer duration
                countdownBox.innerHTML = timerDurationHours.toString().padStart(2,'0') + ':' + timerDurationMinutes.toString().padStart(2,'0') + ':' + timerDurationSeconds.toString().padStart(2,'0')
            } else {
                // Display the time left
                countdownBox.innerHTML = hours.toString().padStart(2,'0') + ':' + minutes.toString().padStart(2,'0') + ':' + seconds.toString().padStart(2,'0')
            }
        } else {
            // Display 'Service completed'
            countdownBox.innerHTML = 'Service completed'
        }
    }
    }, 1000)
})