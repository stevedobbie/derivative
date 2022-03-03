from .common import MeasureSerializer
from jwt_auth.serializers.common import UserSerializer

class PopulatedMeasureSerializer(MeasureSerializer):
    owner = UserSerializer()