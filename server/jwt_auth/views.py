from rest_framework.views import APIView # Base class to extend from
from django.contrib.auth import get_user_model # User model
from rest_framework import status # Response
from rest_framework.response import Response # Response
from rest_framework.exceptions import PermissionDenied # Exceptions
from .serializers.common import UserSerializer # Serializers
from datetime import datetime, timedelta # Time imports for JWT

# User model
User = get_user_model()

# Create your views here.
class RegisterView(APIView):
    
    def post(self, request):
        user_to_add = UserSerializer(data=request.data)
        try: 
            print(user_to_add)
            user_to_add.is_valid()
            user_to_add.save()
            return Response(user_to_add.data, status=status.HTTP_201_CREATED)
        except:
            return Response("Failed to add user", status=status.HTTP_422_UNPROCESSABLE_ENTITY)