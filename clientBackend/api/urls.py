from django.urls import path

from .views import broker_proxy

urlpatterns = [
    path("brokers/", broker_proxy),
    path("brokers/<slug:slug>/", broker_proxy),
    path("reviews/", broker_proxy),
]
