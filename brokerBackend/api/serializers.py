from rest_framework import serializers

from .models import Broker, Company, CompanyAddress, Review, Role, User


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "code", "name", "description", "permissions"]


class CompanyAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyAddress
        fields = [
            "id", "company", "address_type", "address", "city", "state",
            "postal_code", "country", "email", "phone", "is_primary",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CompanySerializer(serializers.ModelSerializer):
    addresses = CompanyAddressSerializer(many=True, read_only=True)

    class Meta:
        model = Company
        fields = [
            "id", "brand_name", "legal_name", "registration_number", "register_region",
            "operating_period", "country", "jurisdiction", "email", "contact_number",
            "website_url", "verified_site", "business_region", "about_us",
            "company_profile_description", "status", "addresses", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "email", "password_hash", "first_name", "last_name", "phone",
            "status", "email_verified",
            "last_login_at", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {"password_hash": {"write_only": True}}


class ReviewSerializer(serializers.ModelSerializer):
    broker_id = serializers.PrimaryKeyRelatedField(source="broker", read_only=True)
    review = serializers.CharField(source="body")

    class Meta:
        model = Review
        fields = [
            "id", "broker_id", "author_name", "country", "rating", "headline",
            "review", "platform", "experience", "status", "moderator_notes", "created_at",
        ]
        read_only_fields = ["id", "broker_id", "status", "moderator_notes", "created_at"]


class BrokerSerializer(serializers.ModelSerializer):
    company_detail = CompanySerializer(source="company", read_only=True)
    user_reviews = serializers.SerializerMethodField()
    min_deposit_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Broker
        fields = [
            "id", "slug", "name", "company", "company_detail", "logo_text", "logo_url", "affiliate_url", "hq", "founded",
            "parent_company", "primary_license", "editorial_rating", "editorial_score_100",
            "editorial_class", "user_rating", "review_count", "eur_usd_spread", "min_deposit",
            "min_deposit_formatted", "max_leverage_retail", "execution_model", "platforms",
            "ratings_breakdown", "regulations", "spreads_table", "account_types", "pros", "cons",
            "best_for_summary", "not_ideal_for_summary", "verdict_summary", "fact_checked_date",
            "is_regulated_tier1", "user_reviews",
        ]

    def get_user_reviews(self, broker: Broker) -> list[dict]:
        return ReviewSerializer(broker.reviews.filter(status=Review.Status.APPROVED), many=True).data

    def get_min_deposit_formatted(self, broker: Broker) -> str:
        return f"${broker.min_deposit:,.2f}"


class ReviewSubmissionSerializer(serializers.ModelSerializer):
    broker_id = serializers.PrimaryKeyRelatedField(source="broker", queryset=Broker.objects.all())
    review = serializers.CharField(source="body")

    class Meta:
        model = Review
        fields = ["broker_id", "author_name", "country", "rating", "headline", "review", "platform", "experience"]

    def validate_rating(self, value: int) -> int:
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
