from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User as AuthUser

from .models import Broker, Company, CompanyAddress, Review, Role, User


class CompanyAddressInline(admin.StackedInline):
    model = CompanyAddress
    extra = 1
    classes = ("collapse",)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("brand_name", "legal_name", "country", "status", "verified_site", "created_at")
    list_filter = ("status", "verified_site", "country")
    search_fields = ("brand_name", "legal_name", "registration_number", "email")
    ordering = ("brand_name",)
    inlines = [CompanyAddressInline]


@admin.register(CompanyAddress)
class CompanyAddressAdmin(admin.ModelAdmin):
    list_display = ("company", "address_type", "city", "state", "country", "is_primary", "created_at")
    list_filter = ("address_type", "is_primary", "country")
    search_fields = ("company__brand_name", "address", "city", "country", "email", "phone")


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
