from django.forms import ModelForm
from django import forms
from .models import Timer, ServerTimezone
from django.utils import timezone
import pytz
class TimerLogisticsForm(ModelForm):
    class Meta:
            model = Timer
            exclude = ['can_disconnect',]

class TimerSystemForm(ModelForm):
    class Meta:
            model = Timer
            exclude = ['flag','paused','duration','when','time_to_yellow', 'time_to_red',]
    def __init__(self, *args, **kwargs):
        super(TimerSystemForm, self).__init__(*args, **kwargs)
        self.fields['name'].widget.attrs['readonly'] = True
        self.fields['full_name'].widget.attrs['readonly'] = True

class ServerTimezoneForm(ModelForm):
    class Meta:
        model = ServerTimezone
        fields = ['timezone']
        widgets = {
            'timezone': forms.Select(choices=[(tz, tz) for tz in pytz.common_timezones]),
        }