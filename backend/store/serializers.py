from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from .models import NewsletterSubscriber, Order, OrderItem, Product

User = get_user_model()


class ProductSerializer(serializers.ModelSerializer):
    category_label = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'category', 'category_label',
            'image', 'badge', 'bg_class', 'stock',
        ]


class OrderItemWriteSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('This email is already registered.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)


class OrderCreateSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    pin_code = serializers.CharField(max_length=10)
    state = serializers.CharField(max_length=100)
    payment_method = serializers.CharField(max_length=50)
    upi_id = serializers.CharField(max_length=100, required=False, allow_blank=True)
    items = OrderItemWriteSerializer(many=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('Cart cannot be empty.')
        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        product_ids = [item['product_id'] for item in items_data]
        products = Product.objects.filter(id__in=product_ids, is_active=True)
        product_map = {p.id: p for p in products}

        subtotal = 0
        order_items = []
        for line in items_data:
            product = product_map.get(line['product_id'])
            if not product:
                raise serializers.ValidationError(
                    {'items': f'Product {line["product_id"]} is unavailable.'}
                )
            if product.stock < line['quantity']:
                raise serializers.ValidationError(
                    {'items': f'Not enough stock for {product.name}.'}
                )
            subtotal += product.price * line['quantity']
            order_items.append((product, line['quantity']))

        threshold = getattr(settings, 'FREE_SHIPPING_THRESHOLD', 999)
        shipping_fee = getattr(settings, 'SHIPPING_FEE', 99)
        shipping = 0 if subtotal >= threshold else shipping_fee
        total = subtotal + shipping

        order_number = self.context['order_number']
        user = self.context['request'].user
        order = Order.objects.create(
            order_number=order_number,
            user=user,
            subtotal=subtotal,
            shipping=shipping,
            total=total,
            **validated_data,
        )

        for product, qty in order_items:
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                price=product.price,
                quantity=qty,
            )
            product.stock -= qty
            product.save(update_fields=['stock'])

        return order


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product_name', 'price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'order_number', 'first_name', 'last_name', 'email', 'phone',
            'address', 'city', 'pin_code', 'state', 'payment_method',
            'subtotal', 'shipping', 'total', 'status', 'created_at', 'items',
        ]


class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['email']
