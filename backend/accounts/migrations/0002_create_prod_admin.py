from django.db import migrations
from django.contrib.auth.hashers import make_password


def create_or_update_prod_admin(apps, schema_editor):
    User = apps.get_model("auth", "User")

    username = "Meghasyam99"
    email = "uppumeghasyam16@gmail.com"
    password = "Itachi123@"

    user, _created = User.objects.get_or_create(
        username=username,
        defaults={
            "email": email,
            "is_active": True,
            "is_staff": True,
            "is_superuser": True,
        },
    )

    user.email = email
    user.is_active = True
    user.is_staff = True
    user.is_superuser = True
    user.password = make_password(password)
    user.save(update_fields=["email", "is_active", "is_staff", "is_superuser", "password"])


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_or_update_prod_admin, migrations.RunPython.noop),
    ]