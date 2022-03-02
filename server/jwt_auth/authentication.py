
from rest_framework.authentication import BasicAuthentication # Auth class
from rest_framework.exceptions import PermissionDenied # Exceptions
from django.contrib.auth import get_user_model # Models
from django.conf import settings # Secret key
import jwt # json web token

# Get user model
User = get_user_model()

# Custom auth class
class JWTAuthentication(BasicAuthentication):
    
    def authenticate(self, request):
        
        header = request.headers.get('Authorization') # Check authorisation header is present

        if not header: 
            return None
        
        if not header.startswith('Bearer'): # Check valid Bearer Token format
            raise PermissionDenied(detail="Invalid token format - Bearer Token required")
        
        token = header.replace('Bearer ', '') # Remove 'Bearer ' prefix

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = User.objects.get(pk=payload.get('sub'))
        
        except jwt.exceptions.InvalidTokenError as error:
            print(error)
            raise PermissionDenied(detail="Invalid Token")
        except User.DoesNotExist as error:
            print(error)
            raise PermissionDenied(detail="User Does Not Exist")
        
        return (user, token)