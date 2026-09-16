from django.contrib import admin

from .models import Broker, Review


@admin.register(Broker)
class BrokerAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "published", "editorial_score_100", "updated_at")
    list_filter = ("published", "is_regulated_tier1")
    search_fields = ("name", "slug", "primary_license")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("headline", "broker", "rating", "status", "created_at")
    list_filter = ("status", "rating")
    search_fields = ("headline", "author_name", "broker__name")
