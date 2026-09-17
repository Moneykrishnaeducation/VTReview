from django.urls import path

from .views import (
    AuthorBrokerListView,
    AuthorReviewListView,
    AuthorReviewModerationView,
    AuthorUserDetailView,
    AuthorUserListCreateView,
    BrokerDetailView,
    BrokerListView,
    HealthView,
    ReviewCreateView,
    RoleListView,
)

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("roles/", RoleListView.as_view(), name="role-list"),
    path("brokers/", BrokerListView.as_view(), name="broker-list"),
    path("brokers/<slug:slug>/", BrokerDetailView.as_view(), name="broker-detail"),
    path("reviews/", ReviewCreateView.as_view(), name="review-create"),
    path("author/brokers/", AuthorBrokerListView.as_view(), name="author-broker-list"),
    path("author/reviews/", AuthorReviewListView.as_view(), name="author-review-list"),
    path("author/reviews/<int:pk>/moderate/", AuthorReviewModerationView.as_view(), name="author-review-moderate"),
    path("author/users/", AuthorUserListCreateView.as_view(), name="author-user-list-create"),
    path("author/users/<uuid:pk>/", AuthorUserDetailView.as_view(), name="author-user-detail"),
]
