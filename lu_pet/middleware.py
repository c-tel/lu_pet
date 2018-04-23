from lu_pet.models import Session


class AuthMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            key = request.COOKIES.get('sessid')
            session = Session.objects.get(key=key)
            request.user = session.user
            request.session = session
        except Session.DoesNotExist:
            request.user = None
            request.session = None
        response = self.get_response(request)
        return response
