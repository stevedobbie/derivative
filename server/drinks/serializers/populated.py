from .common import DrinkSerializer
from measures.serializers.populated import PopulatedMeasureSerializer
from bids.serializers.populated import PopulatedBidSerializer

# Serializers
class PopulatedDrinkSerializer(DrinkSerializer):
    measures = PopulatedMeasureSerializer(many=True)
    bids = PopulatedBidSerializer(many=True)