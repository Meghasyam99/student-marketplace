from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Category, Product, ProductImage, WishlistItem

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "slug", "name", "is_active"]


class SellerSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="profile.full_name", read_only=True)
    college_name = serializers.CharField(source="profile.college_name", read_only=True)
    phone_number = serializers.CharField(source="profile.phone_number", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name", "college_name", "phone_number"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    seller = SellerSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category",
        queryset=Category.objects.filter(is_active=True),
        write_only=True,
    )
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "price",
            "description",
            "condition",
            "is_active",
            "is_reported",
            "created_at",
            "updated_at",
            "seller",
            "category",
            "category_id",
            "images",
        ]
        read_only_fields = ["is_reported"]


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ["id", "product", "created_at"]


class WishlistToggleSerializer(serializers.Serializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True),
        source="product",
    )
