from django.urls import path

from .views import (
    AuthorBrokerListView,
    AuthorReviewListView,
    AuthorReviewModerationView,
    BrokerDetailView,
    BrokerListView,
    HealthView,
    ReviewCreateView,
)

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("brokers/", BrokerListView.as_view(), name="broker-list"),
    path("brokers/<slug:slug>/", BrokerDetailView.as_view(), name="broker-detail"),
    path("reviews/", ReviewCreateView.as_view(), name="review-create"),
    path("author/brokers/", AuthorBrokerListView.as_view(), name="author-broker-list"),
    path("author/reviews/", AuthorReviewListView.as_view(), name="author-review-list"),
    path("author/reviews/<int:pk>/moderate/", AuthorReviewModerationView.as_view(), name="author-review-moderate"),
]
