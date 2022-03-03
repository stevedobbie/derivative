from rest_framework.views import APIView
from rest_framework.response import Response # Response
from rest_framework import status # Response
from rest_framework.exceptions import NotFound, PermissionDenied # Exceptions
from django.db import IntegrityError # Exceptions

from measures.serializers.populated import PopulatedMeasureSerializer # Serializers
from .serializers.common import MeasureSerializer # Serializers
from rest_framework.permissions import IsAuthenticatedOrReadOnly # Permissions
from .models import Measure

# List views
class MeasureListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    # View all measures
    def get(self, _request):
        measures = Measure.objects.all()
        serialized_measures = MeasureSerializer(measures, many=True)
        return Response(serialized_measures.data, status=status.HTTP_200_OK)

    # Create new measure (this can happen when a user buys a drink from the bartender and drinks.measures_remaining > 0)
    def post(self, request):
        measure_to_add = MeasureSerializer(data=request.data)
        try:
            measure_to_add.is_valid()
            measure_to_add.save()
            return Response(measure_to_add.data, status=status.HTTP_201_CREATED)
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


# Detail views
class MeasureDetailView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    # helper function
    def get_measure(self, pk):
        try:
            return Measure.objects.get(pk=pk)
        except Measure.DoesNotExist:
            raise NotFound(detail="Measure not found")
    
    def get(self, _request, pk):
        measure = self.get_measure(pk=pk)
        serialized_measure = PopulatedMeasureSerializer(measure)
        return Response(serialized_measure.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        measure_to_update = self.get_measure(pk=pk)
        print('Measure_to_update ---->', measure_to_update)
        print('Request_data ---->', request.data)
        serialized_measure = MeasureSerializer(measure_to_update, data=request.data)
        print('Serialised_measure ---->', serialized_measure)
        try:
            serialized_measure.is_valid()
            serialized_measure.save()
            return Response(serialized_measure.data, status=status.HTTP_200_OK)
        # assertion error is thrown when an incorrect datatype is passed as a value
        except AssertionError as error:
            print('AssertionError ---->', str(error))
            return Response({ "detail": str(error) }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        # catch all
        except:
            print('CatchAll ---->')
            return Response({ "detail": "Unprocessable Entity" }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)