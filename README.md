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
- Handle timezones
- Timer model needs picture
- Show picture of timer model in frontend
- Custom time before clock turns red 
- Make it nice looking
- Ability to pause timer for Super Rally
- Inform remaining time when timer is paused

## To implement
- Clock always turns yellow when counter reaches 5 minutes

## Usage

This project has been built with Python 3.11. It probably works with older versions of Python 3, but it has not been tested.

```bash
git clone https://github.com/pinembour/RallyTimer.git
cd RallyTimer
python -m venv env
source env/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

## Docker

This project can be run in a Docker container. The Dockerfile is provided in the repository.
The image includes nginx, and listens by default on port 80.

### Build the image

```bash
docker build -t rallytimer .
```

### Run the container

Be sure to pass to the container the settings.py file with your personal SECRET_KEY and ALLOWED_HOSTS settings.
You can also pass your own private static files (NavBar logo and fonts) to the container /static folder.
The DB is stored in /code/db, so you can create a volume to store it.
As this project is timezone aware, you should also pass the timezone file to the container.

If you wish to create a superuser, you can pass the DJANGO_SUPERUSER_PASSWORD, DJANGO_SUPERUSER_EMAIL and DJANGO_SUPERUSER_USERNAME environment variables to the container.

```bash
# Create a volume to store the DB
docker volume create rallytimer-db
# Run the container
docker run -d --name rallytimer -p 80:80 -v rallytimer-db:/code/db rallytimer -v ./settings.py:/settings/settings.py -v ./static:/static -v /etc/timezone:/etc/timezone:ro -e DJANGO_SUPERUSER_PASSWORD=admin -e DJANGO_SUPERUSER_EMAIL=example@example.com -e DJANGO_SUPERUSER_USERNAME=admin rallytimer
```
