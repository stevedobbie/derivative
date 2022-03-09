from .common import UserSerializer
from measures.serializers.common import MeasureSerializer
from bids.serializers.common import BidSerializer

# Serializers
class PopulatedUserSerializer(UserSerializer):
    measures = MeasureSerializer(many=True)
    bids = BidSerializer(many=True)