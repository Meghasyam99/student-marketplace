from django.contrib import admin

from .models import Category, Product, ProductImage, WishlistItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	list_display = ("name", "slug", "is_active")
	list_filter = ("is_active",)
	search_fields = ("name", "slug")


class ProductImageInline(admin.TabularInline):
	model = ProductImage
	extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
	list_display = ("title", "price", "condition", "is_active", "seller", "category", "created_at")
	list_filter = ("is_active", "condition", "category")
	search_fields = ("title", "description", "seller__username", "seller__email")
	inlines = [ProductImageInline]


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
	list_display = ("user", "product", "created_at")
	search_fields = ("user__username", "user__email", "product__title")
