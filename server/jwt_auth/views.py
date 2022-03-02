from django.conf import settings
from rest_framework.views import APIView # Base class to extend from
from django.contrib.auth import get_user_model # User model
from rest_framework import status # Response
from rest_framework.response import Response # Response
from rest_framework.exceptions import PermissionDenied # Exceptions
from .serializers.common import UserSerializer # Serializers
from datetime import datetime, timedelta # Time imports for JWT
import jwt 

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

class LoginView(APIView):
    
    def post(self, request):
        
        print(request.data)
        try:
            user_to_login = User.objects.get(email=request.data.get('email'))

        # validate user
        except User.DoesNotExist:
            return PermissionDenied(detail="Unauthorised")
        
        # validate password
        if not user_to_login.check_password(request.data.get('password')):
            return PermissionDenied(detail="Unauthorised")

        # create token for validated user
        dt = datetime.now() + timedelta(days=7)
        token = jwt.encode({
            'sub': user_to_login.id,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, 'HS256')

        return Response({
            'token': token,
            'message': f"Welcome back {user_to_login.username}"
        }, status.HTTP_202_ACCEPTED)