# RallyTimer

Django WebApp to create and display multiple countdown timers.
The timers are defined with duration and a starting date.

This configuration in particularly useful in rally racing, where a team is given a certain amount of time to work on a car. The team can set at what time they plan to work on each car, and the timer will start decreasing accordingly.

## Implemented
- Create/update/modify/delete timers
- Display individual timers
- Automatically reload client when a timer is updated
- Display all the timers on the same page
- Before timer starts, timer should display service duration
- Display local time

## To implement
- Make it nice looking
- Timer model needs picture
- Show picture of timer model in frontend
- Handle timezones

## Usage

```bash
git clone https://github.com/pinembour/RallyTimer.git
cd RallyTimer
virtualenv env
source env/bin/activate
pip install -r requirements.txt
python manage.py runserver
```