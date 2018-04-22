from django.shortcuts import render
import json
from lu_pet.models import User, Advertisement
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def main(request):
    return render(request, 'index.html')


def welcome(request):
    return render(request, 'welcome.html')


def sign_up(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        password = data['password']
        email_dispatch = data['email_dispatch']
        email = data['email']
        if not User.sign_up(username, password, email, email_dispatch):
            return JsonResponse({'status': 'error'})
        key = User.sign_in(username, password)
        response = JsonResponse({'status': 'ok'})
        response.set_cookie('sessid', key)
        return response


def sign_in(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        password = data['password']
        sessid = User.sign_in(username, password)
        signed = sessid is not None
        res = {
            'status': 'ok',
            'signed': signed
        }
        response = JsonResponse(res)
        if signed:
            response.set_cookie('sessid', sessid)
        return response


def sign_out(request):
    User.sign_out(request.session)
    return JsonResponse({'status': 'ok'})


def post_advertisement(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        Advertisement.add(user=request.user, data=data)


@csrf_exempt
def get_advertisements(request):
    data = json.loads(request.body.decode('utf-8'))
    resp = Advertisement.ads_info(data)
    return JsonResponse(resp)
