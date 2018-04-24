from django.shortcuts import render, HttpResponsePermanentRedirect, HttpResponseRedirect
import json
from lu_pet.models import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


# pages
def default(request):
    return HttpResponsePermanentRedirect('/home')


def main(request):
    username = request.user.username if request.user else 'user'
    return render(request, 'home.html', {'username': username})


def welcome(request):
    if request.user is None:
        return render(request, 'welcome.html')
    return HttpResponseRedirect('/home')


# API
@csrf_exempt
def sign_up(request):
    if request.method == 'POST':
        dict = json.loads(request.body.decode('utf-8'))
        username = dict['username']
        password = dict['password']
        if not User.objects.filter(username=username).exists():
            add_user(username, password)
            key = Session.objects.authentificate(username, password)
            response = JsonResponse({'status': 'ok'})
            response.set_cookie('sessid', key)
            return response
        return JsonResponse({'status': 'error'})


@csrf_exempt
def sign_in(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        password = data['password']
        sessid = Session.objects.authentificate(username, password)
        if sessid:
            response = JsonResponse({'status': 'ok'})
            response.set_cookie('sessid', sessid)
            return response
    return JsonResponse({'status': 'error'})


@csrf_exempt
def sign_out(request):
    Session.objects.exit(request.session)
    return JsonResponse({'status': 'ok'})


@csrf_exempt
def post_advertisement(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        Advertisement.add(user=request.user, data=data)
    return JsonResponse({'status': 'ok'})


@csrf_exempt
def get_advertisements(request):
    data = json.loads(request.body.decode('utf-8'))
    resp = Advertisement.ads_info(data)
    return JsonResponse(resp, safe=False)


@csrf_exempt
def post_feedback(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        Feedback.add(text=data['text'], contacts=data['contacts'], adv_id=data['adv_id'])
    return JsonResponse({'status': 'ok'})
