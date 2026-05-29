from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import StudentProfile

User = get_user_model()


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        # Default values can be overwritten by registration flow.
        StudentProfile.objects.create(
            user=instance,
            full_name=instance.get_full_name() or instance.username,
            college_name="",
            phone_number="",
        )
