import datetime
from datetime import timedelta
from django.contrib import admin
from django_object_actions import DjangoObjectActions, takes_instance_or_queryset
from .models import Timer
# Register your models here.

class TimerAdmin(DjangoObjectActions, admin.ModelAdmin):
    @takes_instance_or_queryset
    def pause(self, request, queryset):
        for obj in queryset:
            x = datetime.datetime.now(datetime.timezone.utc)
            a = (datetime.datetime.combine(datetime.date.min,obj.duration)-datetime.datetime.min) - (x-obj.when)
            obj.when = obj.when - timedelta(days=1)
            obj.duration = (datetime.datetime.min + a).time() 
            obj.save()
    change_actions = ('pause',)

admin.site.register(Timer, TimerAdmin)
