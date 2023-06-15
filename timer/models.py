from django.db import models
from django.urls import reverse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Create your models here.

class Timer(models.Model):
    name = models.CharField(max_length=50)
    duration = models.TimeField()
    when = models.DateTimeField()
    def __str__(self):
        return str(self.name)

    def get_absolute_url(self):
        return reverse('timer:timer-detail', kwargs={'pk': self.pk})

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
    
        # Send notification to clients
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "admin_changes",  # Group name
            {
                "type": "admin_change_notification",
                "message": "A change was made in the admin.",
            },
        )