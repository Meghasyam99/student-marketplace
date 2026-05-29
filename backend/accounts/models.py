from django.conf import settings
from django.db import models


class StudentProfile(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="profile",
	)
	full_name = models.CharField(max_length=150)
	college_name = models.CharField(max_length=200)
	phone_number = models.CharField(max_length=20, blank=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return f"{self.full_name} ({self.college_name})"
