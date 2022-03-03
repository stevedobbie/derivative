from .common import DrinkSerializer
from measures.serializers.populated import PopulatedMeasureSerializer

# Serializers
class PopulatedDrinkSerializer(DrinkSerializer):
    measures = PopulatedMeasureSerializer(many=True)