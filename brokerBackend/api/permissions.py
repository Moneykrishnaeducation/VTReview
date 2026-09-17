from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAuthOrReadOnly(BasePermission):
    """Allow public reads while restricting writes to staff users."""

    def has_permission(self, request, view) -> bool:
        return request.method in SAFE_METHODS or bool(
            request.user and request.user.is_authenticated and request.user.is_staff
        )


class IsAuthUser(BasePermission):
    """Allow access only to authenticated staff users."""

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user and request.user.is_authenticated and request.user.is_staff
        )


class IsAuthenticated(BasePermission):
    """Allow access only to authenticated users."""

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user and request.user.is_authenticated
        )
