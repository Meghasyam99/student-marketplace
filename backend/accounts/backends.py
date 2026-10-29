from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

User = get_user_model()


class EmailOrUsernameModelBackend(ModelBackend):
    """
    Authenticate against either username or email (case-insensitive).
    If multiple accounts share the same email, tries the password against each.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD) or kwargs.get("email")

        if not username or not password:
            return None

        identifier = str(username).strip()

        # Query users matching username or email case-insensitively
        matching_users = User.objects.filter(
            Q(username__iexact=identifier) | Q(email__iexact=identifier)
        ).order_by("-is_active", "-last_login", "-id")

        for user in matching_users:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user

        return None

