"""lu_pet URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from lu_pet.views import *
from django.conf.urls import url


urlpatterns = [
    url('^$', default),
    url('^home/$', main),
    url('^welcome/$', welcome),
    url('^login/$', sign_in),
    url('^signup/$', sign_up),
    url('^logout/$', sign_out),
    url('^post_adv/$', post_advertisement),
    url('^get_advertisements/$', get_advertisements),
    url('^post_fb/$', post_feedback),
    url('^check_auth/$', authorised),
]
