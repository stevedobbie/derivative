# from functools import partial
# from urllib import request
from django.conf import settings
from rest_framework.views import APIView # Base class to extend from
from django.contrib.auth import get_user_model # User model
from rest_framework import status # Response
from rest_framework.response import Response # Response
from rest_framework.exceptions import PermissionDenied, NotFound # Exceptions
from .serializers.common import UserSerializer # Serializers
from datetime import datetime, timedelta # Time imports for JWT
from rest_framework.permissions import IsAuthenticated
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
        except AssertionError:
            return Response({ "detail": user_to_add.errors }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except:
            return Response({ "detail": "Failed to add user"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class LoginView(APIView):
    
    def post(self, request):
        
        print(request.data)
        try:
            user_to_login = User.objects.get(email=request.data.get('email'))

        # validate user
        except User.DoesNotExist:
            raise PermissionDenied(detail="Unauthorised")
        
        # validate password
        if not user_to_login.check_password(request.data.get('password')):
            raise PermissionDenied(detail="Unauthorised")

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

class ProfileView(APIView):
    permissions_classes = (IsAuthenticated, )

    # get profile for logged in user
    def get(self, request):
        try:
            user = User.objects.get(pk=request.user.id)
            serialized_user = UserSerializer(user)
            return Response(serialized_user.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            raise NotFound(detail="User not found") 

class ProfileDetailView(APIView):
    permissions_classes = (IsAuthenticated, )

    def get_user(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound(detail="User not found")
    
    # get profile for any user based on passed in pk
    def get(self, _request, pk):
        user = self.get_user(pk=pk)
        serialized_user = UserSerializer(user)
        return Response(serialized_user.data, status=status.HTTP_200_OK)

    # update profile for any user based on passed in pk
    # users can change account balance etc of other users (needed for trades) but not personal information
    def put(self, request, pk):
        user_to_update = self.get_user(pk=pk)
        if (user_to_update != request.user):
            fields_to_exclude = {'email', 'username', 'password', 'password_confirmation', 'profile_image', 'loaded_credit'}
            print(request.data)
            fields_to_update = {key: request.data[key] for key in request.data if key not in fields_to_exclude}
            print(fields_to_update)
            serialized_user_to_update = UserSerializer(user_to_update, data=fields_to_update, partial=True)
        if (user_to_update == request.user):
            serialized_user_to_update = UserSerializer(user_to_update, data=request.data, partial=True)
        try:
            serialized_user_to_update.is_valid()
            serialized_user_to_update.save(update_fields=['account_balance', 'income_as_seller', 'cost_as_buyer', ])
            return Response(serialized_user_to_update.data, status=status.HTTP_200_OK)
        # AssertionError
        except AssertionError as error:
            print('AssertionError ---->', str(error))
            return Response({ "detail": str(error) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        # catch all
        except:
            print('CatchAll ---->')
            return Response({ "detail": "Unprocessable Entity" }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


