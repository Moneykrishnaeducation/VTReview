from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User as AuthUser

from .models import Broker, Company, RelatedCompany, Review, Role, User


class RelatedCompanyInline(admin.TabularInline):
    model = RelatedCompany
    fk_name = "company"
    extra = 1
    fields = ("related_company_name", "relationship_type", "country", "registration_number", "website_url")


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("brand_name", "legal_name", "city", "country", "status", "verified_site", "created_at")
    list_filter = ("status", "verified_site", "address_type", "country")
    search_fields = ("brand_name", "legal_name", "registration_number", "address", "city", "email")
    ordering = ("brand_name",)
    inlines = [RelatedCompanyInline]
    fieldsets = (
        ("Company Info", {"fields": ("brand_name", "legal_name", "registration_number", "register_region", "operating_period", "jurisdiction", "status")}),
        ("Contact & Online", {"fields": ("email", "contact_number", "phone", "website_url", "verified_site")}),
        ("Address Details", {"fields": ("address_type", "address", "city", "state", "postal_code", "country", "is_primary")}),
        ("Descriptions", {"fields": ("business_region", "about_us", "company_profile_description")}),
    )


@admin.register(RelatedCompany)
class RelatedCompanyAdmin(admin.ModelAdmin):
    list_display = ("company", "related_company_name", "relationship_type", "country", "created_at")
    list_filter = ("relationship_type", "country")
    search_fields = ("company__brand_name", "related_company_name", "registration_number", "country")


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "created_at")
    search_fields = ("name", "code")
    ordering = ("name",)


# Unregister default AuthUser admin and re-register with role support
admin.site.unregister(AuthUser)


@admin.register(AuthUser)
class CustomAuthUserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "first_name", "last_name", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_superuser", "is_active")
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Role & Permissions", {"fields": ("role",)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Role & Permissions", {"fields": ("role",)}),
    )


@admin.register(User)
class ApiUserAdmin(admin.ModelAdmin):
    list_display = ("email", "first_name", "last_name", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("email", "first_name", "last_name")


@admin.register(Broker)
class BrokerAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "company", "published", "editorial_score_100", "updated_at")
    list_filter = ("published", "is_regulated_tier1", "company")
    search_fields = ("name", "slug", "primary_license", "company__brand_name")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("headline", "broker", "rating", "status", "created_at")
    list_filter = ("status", "rating")
    search_fields = ("headline", "author_name", "broker__name")
