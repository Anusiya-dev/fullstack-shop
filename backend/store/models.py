from django.conf import settings
from django.db import models


class Product(models.Model):
    class Category(models.TextChoices):
        SUMMER = 'summer', 'Summer Edit'
        FESTIVE = 'festive', 'Festive Collection'
        MINIMAL = 'minimal', 'Minimalist'

    name = models.CharField(max_length=200)
    price = models.PositiveIntegerField()
    category = models.CharField(max_length=20, choices=Category.choices)
    image = models.CharField(max_length=255, help_text='Path served by React public folder')
    badge = models.CharField(max_length=50, blank=True, null=True)
    bg_class = models.CharField(max_length=10, default='p1')
    stock = models.PositiveIntegerField(default=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.name


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'

    order_number = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
        null=True,
        blank=True,
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=10)
    state = models.CharField(max_length=100)
    payment_method = models.CharField(max_length=50)
    upi_id = models.CharField(max_length=100, blank=True)
    subtotal = models.PositiveIntegerField()
    shipping = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CONFIRMED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL)
    product_name = models.CharField(max_length=200)
    price = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()

    def line_total(self):
        return self.price * self.quantity


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
