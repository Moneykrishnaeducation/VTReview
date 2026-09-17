import uuid

from django.db import models


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


class Broker(models.Model):
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
