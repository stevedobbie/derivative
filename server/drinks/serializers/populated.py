from .common import DrinkSerializer
from measures.serializers.populated import PopulatedMeasureSerializer
from bids.serializers.common import BidSerializer

# Serializers
class PopulatedDrinkSerializer(DrinkSerializer):
    measures = PopulatedMeasureSerializer(many=True)
    bids = BidSerializer(many=True)