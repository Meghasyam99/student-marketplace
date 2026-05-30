from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        from . import signals  # noqa: F401
        # --- TEMPORARY: Create a superuser on production deploy ---
        try:
            from django.contrib.auth import get_user_model
            from django.db.utils import OperationalError, ProgrammingError

            User = get_user_model()
            if not User.objects.filter(username="Meghasyam99").exists():
                User.objects.create_superuser(
                    username="Meghasyam99",
                    email="uppumeghasyam16@gmail.com",
                    password="Itachi123@"
                )
        except (OperationalError, ProgrammingError):
            # Database isn't ready yet (e.g., during migrations/build). Skip.
            pass
        # --- END TEMPORARY ---
