from django.conf import settings
from django.db import models


class Category(models.Model):
	slug = models.SlugField(max_length=60, unique=True)
	name = models.CharField(max_length=60, unique=True)
	is_active = models.BooleanField(default=True)

	class Meta:
		ordering = ["name"]

	def __str__(self) -> str:
		return self.name


class Product(models.Model):
	class Condition(models.TextChoices):
		LIKE_NEW = "Like New"
		EXCELLENT = "Excellent"
		GOOD = "Good"
		FAIR = "Fair"

	seller = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="products",
	)
	title = models.CharField(max_length=140)
	category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
	price = models.DecimalField(max_digits=10, decimal_places=2)
	description = models.TextField()
	condition = models.CharField(max_length=20, choices=Condition.choices, default=Condition.GOOD)

	is_active = models.BooleanField(default=True)
	is_reported = models.BooleanField(default=False)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-created_at"]

	def __str__(self) -> str:
		return self.title


class ProductImage(models.Model):
	product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
	image = models.ImageField(upload_to="products/%Y/%m/")
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["created_at"]


class WishlistItem(models.Model):
	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="wishlist_items",
	)
	product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="wishlisted_by")
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ("user", "product")
		ordering = ["-created_at"]
