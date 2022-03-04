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

    def post(self, request):
        transaction_to_add = TransactionSerializer(data=request.data)
        try:
            transaction_to_add.is_valid()
            transaction_to_add.save()
            return Response(transaction_to_add.data, status=status.HTTP_201_CREATED)
        # integrity error is thrown when a required field is missing
        except IntegrityError as error:
            print('IntegrityError ---->', str(error))
            return Response({ "detail": str(error) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        # assertion error is thrown when an incorrect datatype is passed as a value
        except AssertionError as error:
            print('AssertionError ---->', str(error))
            return Response({ "detail": str(error) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        # catch all
        except:
            print('CatchAll ---->')
            return Response({ "detail": "Unprocessable Entity" }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)