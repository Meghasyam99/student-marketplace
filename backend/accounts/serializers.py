from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import StudentProfile

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    is_staff = serializers.BooleanField(source="user.is_staff", read_only=True)
    is_superuser = serializers.BooleanField(source="user.is_superuser", read_only=True)

    class Meta:
        model = StudentProfile
        fields = [
            "user_id",
            "username",
            "email",
            "full_name",
            "college_name",
            "phone_number",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
        ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field] = serializers.CharField(required=False, write_only=True)
        self.fields["email"] = serializers.CharField(required=False, write_only=True)
        self.fields["identifier"] = serializers.CharField(required=False, write_only=True)

    def validate(self, attrs):
        username = (
            attrs.get(self.username_field)
            or attrs.get("email")
            or attrs.get("identifier")
            or ""
        ).strip()
        password = attrs.get("password")

        if not username:
            raise serializers.ValidationError({"detail": "Email or username is required."})
        if not password:
            raise serializers.ValidationError({"detail": "Password is required."})

        attrs[self.username_field] = username
        return super().validate(attrs)


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    college_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=20, allow_blank=True, required=False)
    password = serializers.CharField(min_length=6, write_only=True)
    confirm_password = serializers.CharField(min_length=6, write_only=True)

    def validate_email(self, value):
        normalized = value.strip().lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        if User.objects.filter(username__iexact=normalized).exists():
            raise serializers.ValidationError("An account with this email/username already exists.")
        return normalized

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        email = validated_data["email"].strip().lower()
        password = validated_data["password"]

        # Double check uniqueness right before creation
        if User.objects.filter(email__iexact=email).exists() or User.objects.filter(username__iexact=email).exists():
            raise serializers.ValidationError({"email": "An account with this email already exists."})

        # Use email as username for standard students.
        user = User.objects.create_user(username=email, email=email, password=password)

        profile, _ = StudentProfile.objects.get_or_create(
            user=user,
            defaults={
                "full_name": validated_data["full_name"].strip(),
                "college_name": validated_data["college_name"].strip(),
                "phone_number": validated_data.get("phone_number", "").strip(),
            },
        )
        profile.full_name = validated_data["full_name"].strip()
        profile.college_name = validated_data["college_name"].strip()
        profile.phone_number = validated_data.get("phone_number", "").strip()
        profile.save(update_fields=["full_name", "college_name", "phone_number", "updated_at"])

        return user
