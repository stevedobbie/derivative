from .common import MeasureSerializer
from jwt_auth.serializers.common import UserSerializer
from transactions.serializers.common import TransactionSerializer

class PopulatedMeasureSerializer(MeasureSerializer):
    owner = UserSerializer()
    transactions = TransactionSerializer(many=True)