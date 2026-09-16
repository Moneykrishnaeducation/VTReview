from django.urls import path

from .views import broker_proxy

urlpatterns = [
    path("author/brokers/", broker_proxy),
    path("author/reviews/", broker_proxy),
    path("author/reviews/<int:pk>/moderate/", broker_proxy),
]
