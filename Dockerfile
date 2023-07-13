FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install dependencies
RUN apt-get update && apt-get install -y git nginx
RUN git clone https://github.com/pinembour/RallyTimer.git /code/ && pip install -r requirements.txt && mkdir /code/static/priv /code/media 
COPY entryfile.sh /code/entryfile.sh
RUN chmod 0755 /code/entryfile.sh
COPY nginx.conf /etc/nginx/sites-enabled/default

# Run server
CMD ["/bin/sh", "entryfile.sh"]
