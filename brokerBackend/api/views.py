from django.db.models import Q
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Broker, Company, RelatedCompany, Review, Role, User
from .serializers import (
    BrokerSerializer,
    CompanySerializer,
    RelatedCompanySerializer,
    ReviewSerializer,
    ReviewSubmissionSerializer,
    RoleSerializer,
    UserSerializer,
)


class HealthView(APIView):
    def get(self, request):
        return Response({"status": "ok", "service": "broker-backend"})


class RoleListView(generics.ListAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class RelatedCompanyListCreateView(generics.ListCreateAPIView):
    serializer_class = RelatedCompanySerializer

    def get_queryset(self):
        queryset = RelatedCompany.objects.all()
        company_id = self.kwargs.get("company_id") or self.request.query_params.get("companyId")
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset

    def perform_create(self, serializer):
        company_id = self.kwargs.get("company_id")
        if company_id:
            serializer.save(company_id=company_id)
        else:
            serializer.save()


class RelatedCompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RelatedCompany.objects.all()
    serializer_class = RelatedCompanySerializer


class AuthorUserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class AuthorUserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class BrokerListView(generics.ListAPIView):
    serializer_class = BrokerSerializer

    def get_queryset(self):
        queryset = Broker.objects.filter(published=True)
        query = self.request.query_params.get("query")
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query)
                | Q(primary_license__icontains=query)
                | Q(platforms__icontains=query)
            )
        if self.request.query_params.get("tier1Only") == "true":
            queryset = queryset.filter(is_regulated_tier1=True)
        if self.request.query_params.get("tradingViewOnly") == "true":
            queryset = queryset.filter(platforms__contains=["TradingView"])
        return queryset


class BrokerDetailView(generics.RetrieveAPIView):
    serializer_class = BrokerSerializer
    lookup_field = "slug"
    queryset = Broker.objects.filter(published=True)


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSubmissionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        return Response(
            {"success": True, "reviewId": str(review.id), "status": review.status},
            status=status.HTTP_201_CREATED,
        )


class AuthorBrokerListView(generics.ListCreateAPIView):
    queryset = Broker.objects.all()
    serializer_class = BrokerSerializer


class AuthorReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.select_related("broker").filter(status=Review.Status.PENDING)


class AuthorReviewModerationView(APIView):
    def patch(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return Response({"message": "Review not found."}, status=status.HTTP_404_NOT_FOUND)

        next_status = request.data.get("status")
        if next_status not in {Review.Status.APPROVED, Review.Status.REJECTED}:
            return Response({"message": "status must be approved or rejected."}, status=status.HTTP_400_BAD_REQUEST)
        review.status = next_status
        review.moderator_notes = request.data.get("moderatorNotes", "")
        review.save(update_fields=["status", "moderator_notes", "updated_at"])
        return Response(ReviewSerializer(review).data)
