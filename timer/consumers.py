from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class AdminChangeConsumer(WebsocketConsumer):
    def connect(self):
        self.group_name = "admin_changes"
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name,
        )
        self.accept()
    
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name,
        )
    
    def receive(self, text_data):
        if text_data == "__ping__":
            self.send(text_data="__pong__")
        try:
            message_type = int(text_data)
            # Handle the expected message types here
            pass
        except ValueError:
            pass
        # Code to handle receiving data from the client
    
    def admin_change_notification(self, event):
        message = event['message']
        self.send(text_data=message)