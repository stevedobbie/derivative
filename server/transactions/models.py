from django.db import models

# Create your models here.
class Transaction(models.Model):
    price = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    measure = models.ForeignKey(
        "measures.Measure",
        related_name = "transactions",
        blank = True,
        on_delete = models.CASCADE # if the drink is deleted then the measure should also be deleted
    )
    buyer = models.ForeignKey(
        "jwt_auth.User",
        related_name = "transactions_buyer",
        blank = True,
        on_delete = models.CASCADE # if user is deleted their owned measures and transactions are also deleted. 
    )
    seller = models.ForeignKey(
        "jwt_auth.User",
        related_name = "transactions_seller",
        blank = True,
        on_delete = models.CASCADE # if user is deleted their owned measures and transactions are also deleted.
    )

    # reformat string on admin site
    def __str__(self):
        return f"{self.measure} - price: {self.price}, buyer: {self.buyer}, seller: {self.seller}"