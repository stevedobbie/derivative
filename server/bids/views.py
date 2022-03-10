from functools import partial
from rest_framework.views import APIView # Views
from rest_framework.response import Response # Response
from rest_framework import status # Response
from rest_framework.exceptions import NotFound, PermissionDenied # Exceptions
from django.db import IntegrityError

# Models and serializers
from .models import Bid
from .serializers.common import BidSerializer
from .serializers.populated import PopulatedBidSerializer

# Permissions classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# Create your views here.
class BidListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get(self, _request):
        bids = Bid.objects.all()
        serialized_bids = PopulatedBidSerializer(bids, many=True)
        return Response(serialized_bids.data, status=status.HTTP_200_OK)

    def post(self, request):
        request.data["owner"] = request.user.id
        bid_to_add = BidSerializer(data=request.data)
        try:
            bid_to_add.is_valid()
            bid_to_add.save()
            return Response(bid_to_add.data, status=status.HTTP_201_CREATED)
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

class BidDetailView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )
    
    # this route deletes the bid - can be performed by the owner or another user (e.g. when bid price is accepted)
    def delete(self, _request, pk):
        try:
            bid_to_delete = Bid.objects.get(pk=pk)
            bid_to_delete.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Bid.DoesNotExist:
            raise NotFound(detail="Bid not found")
        except:
            return Response( { "detail": "Failed to delete bid" }, status=status.HTTP_401_UNAUTHORIZED)
    
    def put(self, request, pk):
        # checks the user matches the owner of the bid
        bid_to_update = Bid.objects.get(pk=pk)
        if(bid_to_update.owner != request.user):
            raise PermissionDenied(detail="Unauthorised")
        serialized_bid_to_update = BidSerializer(bid_to_update, data=request.data, partial=True)
        try: 
            serialized_bid_to_update.is_valid()
            serialized_bid_to_update.save()
            return Response(serialized_bid_to_update.data, status=status.HTTP_200_OK)
        # AssertionError
        except AssertionError as error:
            print('AssertionError ---->', str(error))
            return Response({ "detail": str(error) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        # catch all
        except:
            print('CatchAll ---->')
            return Response({ "detail": "Unprocessable Entity" }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)