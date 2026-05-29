from django.contrib import admin

from .models import StudentProfile


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
	list_display = ("user", "full_name", "college_name", "phone_number", "created_at")
	search_fields = ("full_name", "college_name", "user__email", "user__username")
