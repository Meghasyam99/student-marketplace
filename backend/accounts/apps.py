from django.contrib.auth import get_user_model

# --- TEMPORARY: Create a superuser on production deploy ---
def create_superuser_once():
    User = get_user_model()
    if not User.objects.filter(username="prodadmin").exists():
        User.objects.create_superuser(
            username="prodadmin",
            email="prodadmin@example.com",
            password="ProdSuperSecret123!"
        )
create_superuser_once()
# --- END TEMPORARY ---
from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        from . import signals  # noqa: F401
