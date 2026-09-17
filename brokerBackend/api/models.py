import uuid

from django.contrib.auth.models import User as AuthUser
from django.db import models


class Role(models.Model):
    name = models.CharField(max_length=80, unique=True)
    code = models.CharField(max_length=40, unique=True)
    description = models.TextField(blank=True)
    permissions = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "role"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


# Map Role into the default Django auth_user table
AuthUser.add_to_class(
    "role",
    models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="auth_users",
        db_column="role_id",
    ),
)


class User(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        SUSPENDED = "suspended", "Suspended"
        BLOCKED = "blocked", "Blocked"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=255, unique=True)
    password_hash = models.CharField(max_length=255)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=30, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    email_verified = models.BooleanField(default=False)
    last_login_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email


class Company(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"

    class AddressType(models.TextChoices):
        REGISTERED = "registered", "Registered"
        OFFICE = "office", "Office"
        BRANCH = "branch", "Branch"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    brand_name = models.CharField(max_length=255)
    legal_name = models.CharField(max_length=255, blank=True)
    registration_number = models.CharField(max_length=100, blank=True)
    register_region = models.CharField(max_length=100, blank=True)
    operating_period = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    jurisdiction = models.CharField(max_length=100, blank=True)
    email = models.EmailField(max_length=255, blank=True)
    contact_number = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    website_url = models.URLField(max_length=1000, blank=True)
    verified_site = models.BooleanField(default=False)
    business_region = models.TextField(blank=True)
    about_us = models.TextField(blank=True)
    company_profile_description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)

    # Address fields merged from company_addresses
    address_type = models.CharField(
        max_length=50,
        choices=AddressType.choices,
        default=AddressType.OFFICE,
        blank=True,
    )
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=30, blank=True)
    is_primary = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "companies"
        ordering = ["brand_name"]
        verbose_name_plural = "Companies"

    def __str__(self) -> str:
        return self.brand_name


class RelatedCompany(models.Model):
    class RelationshipType(models.TextChoices):
        PARENT = "parent", "Parent"
        SUBSIDIARY = "subsidiary", "Subsidiary"
        AFFILIATE = "affiliate", "Affiliate"
        BRAND = "brand", "Brand"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="related_companies",
        db_column="company_id",
    )
    related_company_name = models.CharField(max_length=255)
    related_company = models.ForeignKey(
        Company,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="referenced_by_companies",
        db_column="related_company_id",
    )
    relationship_type = models.CharField(
        max_length=100,
        choices=RelationshipType.choices,
        default=RelationshipType.AFFILIATE,
    )
    country = models.CharField(max_length=100, blank=True)
    registration_number = models.CharField(max_length=100, blank=True)
    website_url = models.URLField(max_length=1000, blank=True)
    description = models.TextField(blank=True)
    source_url = models.URLField(max_length=1000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "related_companies"
        ordering = ["company", "relationship_type", "related_company_name"]
        verbose_name_plural = "Related Companies"

    def __str__(self) -> str:
        return f"{self.company.brand_name} -> {self.related_company_name} ({self.relationship_type})"


class Broker(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="brokers",
    )
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=160)
    logo_text = models.CharField(max_length=80, blank=True)
    logo_url = models.URLField(blank=True)
    affiliate_url = models.URLField(blank=True)
    hq = models.CharField(max_length=120, blank=True)
    founded = models.PositiveIntegerField(null=True, blank=True)
    parent_company = models.CharField(max_length=160, blank=True)
    primary_license = models.CharField(max_length=160, blank=True)
    editorial_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    editorial_score_100 = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    editorial_class = models.CharField(max_length=40, default="Average")
    user_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)
    eur_usd_spread = models.DecimalField(max_digits=8, decimal_places=4, default=0)
    min_deposit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    max_leverage_retail = models.CharField(max_length=40, blank=True)
    execution_model = models.CharField(max_length=80, blank=True)
    platforms = models.JSONField(default=list)
    ratings_breakdown = models.JSONField(default=dict)
    regulations = models.JSONField(default=list)
    spreads_table = models.JSONField(default=list)
    account_types = models.JSONField(default=list)
    pros = models.JSONField(default=list)
    cons = models.JSONField(default=list)
    best_for_summary = models.JSONField(default=list)
    not_ideal_for_summary = models.JSONField(default=list)
    verdict_summary = models.TextField(blank=True)
    fact_checked_date = models.DateField(null=True, blank=True)
    is_regulated_tier1 = models.BooleanField(default=False)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-editorial_score_100", "name"]

    def __str__(self) -> str:
        return self.name


class Review(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending_moderation", "Pending moderation"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    broker = models.ForeignKey(Broker, related_name="reviews", on_delete=models.CASCADE)
    author_name = models.CharField(max_length=120)
    country = models.CharField(max_length=80, blank=True)
    rating = models.PositiveSmallIntegerField()
    headline = models.CharField(max_length=180)
    body = models.TextField()
    platform = models.CharField(max_length=80, blank=True)
    experience = models.CharField(max_length=80, blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING)
    moderator_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.broker.name}: {self.headline}"
