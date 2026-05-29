from decimal import Decimal

from django.db.models import Q
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from .models import Category, Product, ProductImage, WishlistItem
from .serializers import (
	CategorySerializer,
	ProductSerializer,
	WishlistItemSerializer,
	WishlistToggleSerializer,
)


class IsSellerOrReadOnly(permissions.BasePermission):
	def has_object_permission(self, request, view, obj):
		if request.method in permissions.SAFE_METHODS:
			return True
		return getattr(obj, "seller_id", None) == request.user.id


class CategoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
	queryset = Category.objects.filter(is_active=True)
	serializer_class = CategorySerializer
	permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
	serializer_class = ProductSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]

	class OptionalPagination(PageNumberPagination):
		page_size = 12
		page_size_query_param = "page_size"
		max_page_size = 100

	def get_queryset(self):
		qs = Product.objects.select_related("seller", "seller__profile", "category").prefetch_related("images")
		if self.request.method in permissions.SAFE_METHODS:
			return qs.filter(is_active=True)
		return qs

	def _apply_filters(self, qs):
		params = self.request.query_params

		q = (params.get("q") or "").strip()
		if q:
			qs = qs.filter(
				Q(title__icontains=q)
				| Q(description__icontains=q)
				| Q(category__name__icontains=q)
				| Q(category__slug__icontains=q)
			)

		category = (params.get("category") or "").strip()
		if category and category.lower() != "all":
			if category.isdigit():
				qs = qs.filter(category_id=int(category))
			else:
				qs = qs.filter(category__slug=category)

		condition = (params.get("condition") or "").strip()
		if condition:
			qs = qs.filter(condition=condition)

		min_price = (params.get("min_price") or "").strip()
		if min_price:
			try:
				qs = qs.filter(price__gte=Decimal(min_price))
			except Exception:
				pass

		max_price = (params.get("max_price") or "").strip()
		if max_price:
			try:
				qs = qs.filter(price__lte=Decimal(max_price))
			except Exception:
				pass

		mine = (params.get("mine") or "").strip()
		if mine == "1":
			if getattr(self.request, "user", None) and self.request.user.is_authenticated:
				qs = qs.filter(seller=self.request.user)
			else:
				qs = qs.none()

		ordering = (params.get("ordering") or "").strip().lower()
		if ordering == "price_asc":
			qs = qs.order_by("price", "-created_at")
		elif ordering == "price_desc":
			qs = qs.order_by("-price", "-created_at")
		elif ordering == "oldest":
			qs = qs.order_by("created_at")
		else:
			# latest (default)
			qs = qs.order_by("-created_at")

		return qs

	def list(self, request, *args, **kwargs):
		qs = self.filter_queryset(self.get_queryset())
		qs = self._apply_filters(qs)

		paginate = request.query_params.get("paginate") == "1" or "page" in request.query_params
		if paginate:
			paginator = self.OptionalPagination()
			page = paginator.paginate_queryset(qs, request, view=self)
			serializer = self.get_serializer(page, many=True)
			return paginator.get_paginated_response(serializer.data)

		serializer = self.get_serializer(qs, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		serializer.save(seller=self.request.user)

	@action(
		detail=True,
		methods=["post"],
		permission_classes=[permissions.IsAuthenticated, IsSellerOrReadOnly],
		parser_classes=[MultiPartParser, FormParser],
		url_path="upload-image",
	)
	def upload_image(self, request, pk=None):
		product = self.get_object()
		file = request.FILES.get("image")
		if not file:
			return Response({"image": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
		img = ProductImage.objects.create(product=product, image=file)
		return Response({"id": img.id, "image": img.image.url}, status=status.HTTP_201_CREATED)


class WishlistViewSet(viewsets.ViewSet):
	permission_classes = [permissions.IsAuthenticated]

	def list(self, request):
		items = (
			WishlistItem.objects.filter(user=request.user)
			.select_related("product", "product__seller", "product__seller__profile", "product__category")
			.prefetch_related("product__images")
		)
		return Response(WishlistItemSerializer(items, many=True).data)

	@action(detail=False, methods=["post"], url_path="toggle")
	def toggle(self, request):
		serializer = WishlistToggleSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		product = serializer.validated_data["product"]

		existing = WishlistItem.objects.filter(user=request.user, product=product).first()
		if existing:
			existing.delete()
			return Response({"saved": False})

		WishlistItem.objects.create(user=request.user, product=product)
		return Response({"saved": True})
