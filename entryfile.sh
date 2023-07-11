#!/bin/bash

cp -rf /static/* /code/static/priv/
chmod -R 755 /code/static/priv/
service nginx start
cp -f /settings/settings.py RallyTimer/settings.py
TIMEZONE=$(cat /etc/timezone)
ln -sf /usr/share/zoneinfo/${TIMEZONE} /etc/localtime
python manage.py collectstatic --no-input
python manage.py makemigrations
python manage.py migrate

cat <<EOF | python manage.py shell
import os
from django.contrib.auth import get_user_model
User = get_user_model()

username = os.getenv('DJANGO_SUPERUSER_USERNAME')
email = os.getenv('DJANGO_SUPERUSER_EMAIL')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD')
if username and email and password:
    User.objects.filter(username='admin').exists() or \
        User.objects.create_superuser(username, email, password)
EOF

python manage.py runserver