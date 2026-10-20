from django.urls import path

from .views import (
    LoginView,
    LogoutView,
    MeView,
    NewsletterSubscribeView,
    OrderCreateView,
    OrderDetailView,
    OrderListView,
    ProductDetailView,
    ProductListView,
    RegisterView,
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('orders/', OrderCreateView.as_view(), name='order-create'),
    path('orders/list/', OrderListView.as_view(), name='order-list'),
    path('orders/<str:order_number>/', OrderDetailView.as_view(), name='order-detail'),
    path('newsletter/', NewsletterSubscribeView.as_view(), name='newsletter'),
]
