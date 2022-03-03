from rest_framework.views import APIView # Views
from rest_framework.response import Response # Response
from rest_framework import status # Response
from rest_framework.exceptions import NotFound # Exceptions
from django.db import IntegrityError

# Models and serializers
from .models import Drink
from .serializers.common import DrinkSerializer

# Permissions classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# Create your views here.
class DrinkListView(APIView):
    permissions_classes = (IsAuthenticatedOrReadOnly, ) # read (get) only if user is not authenticated

    def get(self, _request):
        drinks = Drink.objects.all()
        serialized_drinks = DrinkSerializer(drinks, many=True)
        return Response(serialized_drinks.data, status=status.HTTP_200_OK)

class DrinkDetailView(APIView):
    def get_drink(self, pk):
        
        # helper function to check if drink exists
        try:
            return Drink.objects.get(pk=pk)
        except Drink.DoesNotExist:
            raise NotFound(detail="Drink not found")

    # if drinks exists return the record matching the passed in pk
    def get(self, _request, pk):
        drink = self.get_drink(pk=pk)
        serialized_drink = DrinkSerializer(drink)
        return Response(serialized_drink.data, status=status.HTTP_200_OK)