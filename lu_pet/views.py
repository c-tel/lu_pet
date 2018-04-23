from django.shortcuts import render, HttpResponsePermanentRedirect
import json
from lu_pet.models import User, Advertisement
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


# pages
def default(request):
    return HttpResponsePermanentRedirect('/home')


def main(request):
    return render(request, 'home.html')


def welcome(request):
    return render(request, 'welcome.html')


# API
@csrf_exempt
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


@csrf_exempt
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


@csrf_exempt
def sign_out(request):
    User.sign_out(request.session)
    return JsonResponse({'status': 'ok'})


@csrf_exempt
def post_advertisement(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        Advertisement.add(user=request.user, data=data)


@csrf_exempt
def get_advertisements(request):
    data = json.loads(request.body.decode('utf-8'))
    resp = Advertisement.ads_info(data)
    return JsonResponse(resp)
