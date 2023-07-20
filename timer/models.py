from django.db import models
from django.urls import reverse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import datetime

# Create your models here.

class Timer(models.Model):
    name = models.SlugField()
    full_name = models.CharField(max_length=50, default="") # Full name, displayed on the timer pages
    paused = models.BooleanField(default=False) # Whether the timer is paused
    duration = models.TimeField() # Length of the timer
    when = models.DateTimeField() # When the timer will start
    flag = models.ImageField(upload_to='flag', default='white.png') # Flag to display next to the driver name
    time_to_red = models.TimeField(default=datetime.time(00,00)) # Time to change the countdown to red
    time_to_yellow = models.TimeField(default=datetime.time(00,00)) # Time to change the countdown to yellow
    def __str__(self):
        return str(self.name)

    def get_absolute_url(self):
        return reverse('timer:timer-detail', kwargs={"slug": self.name})

    def save_paused(self, *args, **kwargs):
        super().save(*args, **kwargs)
    
        # When saving a Timer, send a WS message to all clients.
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "admin_changes",
            {
                "type": "admin_change_notification",
                "message": "A change was made in the admin.",
            },
        )
        

    def save(self, *args, **kwargs):
        # Unpause the timer when saving
        self.paused = False        
        super().save(*args, **kwargs)
    
        # When saving a Timer, send a WS message to all clients.
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "admin_changes",
            {
                "type": "admin_change_notification",
                "message": "A change was made in the admin.",
            },
        )