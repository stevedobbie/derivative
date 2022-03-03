from rest_framework import serializers 
from ..models import Drink

class DrinkSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Drink
        fields = '__all__' # returns all fields from the queryset