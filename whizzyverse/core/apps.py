from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'whizzyverse.core'

    def ready(self):
        import whizzyverse.core.signals
