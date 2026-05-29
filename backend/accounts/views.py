from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ProfileSerializer, RegisterSerializer


class RegisterView(APIView):
	permission_classes = [permissions.AllowAny]

	def post(self, request):
		serializer = RegisterSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		return Response(
			{"id": user.id, "email": user.email, "username": user.username},
			status=status.HTTP_201_CREATED,
		)


class ProfileView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		profile = request.user.profile
		return Response(ProfileSerializer(profile).data)

	def patch(self, request):
		profile = request.user.profile
		serializer = ProfileSerializer(profile, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data)
