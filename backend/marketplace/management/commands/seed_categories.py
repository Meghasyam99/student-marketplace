from django.core.management.base import BaseCommand

from marketplace.constants import STUDENT_CATEGORIES
from marketplace.models import Category


class Command(BaseCommand):
    help = "Seed the student-only categories"

    def handle(self, *args, **options):
        created = 0
        for slug, name in STUDENT_CATEGORIES:
            _, was_created = Category.objects.get_or_create(slug=slug, defaults={"name": name})
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded categories. Created: {created}"))
