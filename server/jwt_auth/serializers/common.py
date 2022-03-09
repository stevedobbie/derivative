from rest_framework import serializers # Serializers
from django.contrib.auth import get_user_model, password_validation # User model and validation
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError

# Get user model
User = get_user_model()

# Serializers
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):
        if data.get('password'):
            password = data.pop('password')
            password_confirmation = data.pop('password_confirmation')

            if password != password_confirmation:
                raise ValidationError({ 'password_confirmation': 'Passwords do not match' })

            try: 
                password_validation.validate_password(password)
            
            except ValidationError as error:
                print(error)
                raise ValidationError({ 'password': error })
            
            data['password'] = make_password(password)
        return data
    
    class Meta:
        model = User
        fields = ("id", "email", "username", "profile_image", "account_balance", "password", "password_confirmation", "income_as_seller", "cost_as_buyer", "loaded_credit", "measures", "bids") 
