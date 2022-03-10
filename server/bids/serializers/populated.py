from .common import BidSerializer
from jwt_auth.serializers.common import UserSerializer

class PopulatedBidSerializer(BidSerializer):
    owner = UserSerializer()