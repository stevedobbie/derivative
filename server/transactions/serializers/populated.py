from .common import TransactionSerializer
from measures.serializers.common import MeasureSerializer

class PopulatedTransactionSerializer(TransactionSerializer):
    measure = MeasureSerializer()