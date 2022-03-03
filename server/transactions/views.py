from rest_framework.views import APIView
from rest_framework.response import Response # Response
from rest_framework import status # Response
from rest_framework.exceptions import NotFound, PermissionDenied # Exceptions
from django.db import IntegrityError # Exceptions

from .serializers.populated import PopulatedTransactionSerializer # Serializers
from .serializers.common import TransactionSerializer # Serializers
from rest_framework.permissions import IsAuthenticatedOrReadOnly # Permissions
from .models import Transaction

# Create your views here.
class TransactionListView(APIView):
    permissions_classes = (IsAuthenticatedOrReadOnly, )

    def get(self, _request):
        transactions = Transaction.objects.all()
        serialized_transactions = TransactionSerializer(transactions, many=True)
        return Response(serialized_transactions.data, status=status.HTTP_200_OK)