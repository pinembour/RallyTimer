from django.db import models
from django.urls import reverse

# Create your models here.

class Timer(models.Model):
    name = models.CharField(max_length=50)
    duration = models.TimeField()
    when = models.DateTimeField()
    def __str__(self):
        return str(self.name)

    def get_absolute_url(self):
        return reverse('timer:timer-detail', kwargs={'pk': self.pk})
    