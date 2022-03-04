from rest_framework.views import APIView # Views
from rest_framework.response import Response # Response
from rest_framework import status # Response
from rest_framework.exceptions import NotFound # Exceptions
from django.db import IntegrityError

# Models and serializers
from .models import Bid
from .serializers.common import BidSerializer

# Permissions classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# Create your views here.
class BidListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get(self, _request):
        bids = Bid.objects.all()
        serialized_bids = BidSerializer(bids, many=True)
        return Response(serialized_bids.data, status=status.HTTP_200_OK)