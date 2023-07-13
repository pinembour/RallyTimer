import datetime
from datetime import timedelta
from django.contrib import admin, messages
from django_object_actions import DjangoObjectActions, takes_instance_or_queryset
from .models import Timer
# Register your models here.

class TimerAdmin(DjangoObjectActions, admin.ModelAdmin):
    #Add pause button to each timer. Pause button will change the duration to the time remaining and set the timer start time to 1 day ago.
    @takes_instance_or_queryset
    def pause(self, request, queryset):
        for obj in queryset:
            if obj.paused:
                messages.error(request, "Timer is already paused.")
                return
            nowUTC = datetime.datetime.now(datetime.timezone.utc)
            durationDelta = (datetime.datetime.combine(datetime.date.min,obj.duration)-datetime.datetime.min)
            timeLeft = durationDelta - (nowUTC-obj.when)
            if timeLeft > durationDelta:
                messages.error(request, "Cannot pause timer that has not started.")
                return
            if timeLeft < datetime.timedelta(seconds=0):
                messages.error(request, "Cannot pause timer that has already ended.")
                return
            obj.when = obj.when - timedelta(days=1)
            obj.duration = (datetime.datetime.min + timeLeft).time() 
            obj.paused = True
            obj.save_paused()
    change_actions = ('pause',)

admin.site.register(Timer, TimerAdmin)
