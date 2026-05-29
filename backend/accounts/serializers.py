from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import StudentProfile

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = StudentProfile
        fields = [
            "user_id",
            "username",
            "email",
            "full_name",
            "college_name",
            "phone_number",
            "created_at",
            "updated_at",
        ]


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    college_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=20, allow_blank=True, required=False)
    password = serializers.CharField(min_length=6, write_only=True)
    confirm_password = serializers.CharField(min_length=6, write_only=True)

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return attrs

    def create(self, validated_data):
        email = validated_data["email"].strip().lower()
        password = validated_data["password"]

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Email already registered"})

        # Use email as username for simplicity.
        user = User.objects.create_user(username=email, email=email, password=password)

        profile = user.profile
        profile.full_name = validated_data["full_name"].strip()
        profile.college_name = validated_data["college_name"].strip()
        profile.phone_number = validated_data.get("phone_number", "").strip()
        profile.save(update_fields=["full_name", "college_name", "phone_number", "updated_at"])

        return user
