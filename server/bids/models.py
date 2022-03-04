from django.db import models

# Create your models here.
class Bid(models.Model):
    offer_to_buy = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name = "bids",
        blank = True,
        on_delete = models.CASCADE # if user is deleted their owned bids are also deleted.
    )
    drink = models.ForeignKey(
        "drinks.Drink",
        related_name = "bids",
        blank = True,
        on_delete = models.CASCADE # if the drink is deleted then the bid should also be deleted
    )

    # reformat string on admin site
    def __str__(self):
        return f"{self.drink} - offer to buy: {self.offer_to_buy}, buyer: {self.owner}"