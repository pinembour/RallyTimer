from django.forms import ModelForm
from .models import Timer

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