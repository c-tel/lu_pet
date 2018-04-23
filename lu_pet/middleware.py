from lu_pet.models import sessions


class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        key = request.COOKIES.get('sessid', None)
        request.session = key
        response = self.get_response(request)
        return response
