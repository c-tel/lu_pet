from django.contrib.auth.models import AbstractUser
from django.db import models
import random
import string


class User(AbstractUser):
    email_dispatch = models.BooleanField()

    @staticmethod
    def reserved(username):
        try:
            User.objects.get(username=username)
            return False
        except User.DoesNotExist:
            return True

    @staticmethod
    def sign_up(username, password, email, email_dispatch):
        if not User.reserved(username):
            user = User(username=username, password=password, email=email, email_dispatch=email_dispatch)
            user.save()
            return user
        return None

    @staticmethod
    def sign_in(username, password):
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                key = generate_key()
                sessions[key] = user
                return key
            return None
        except User.DoesNotExist:
            return None

    @staticmethod
    def sign_out(key):
        del sessions[key]


class Advertisement(models.Model):
    DOG = 0
    CAT = 1
    OTHER = 2
    PET_CHOICES = (
        (DOG, 'Dog'),
        (CAT, 'Cat'),
        (OTHER, 'Other')
    )
    lost = models.BooleanField()
    author = models.ForeignKey(User)
    pet = models.SmallIntegerField(choices=PET_CHOICES, default=OTHER)
    title = models.CharField(max_length=64)
    text = models.CharField(max_length=500)
    date_created = models.DateField(auto_now=True)

    @staticmethod
    def ads_info(filters_dict):
        ads = Advertisement.objects.all()
        ads.filter(**filters_dict).order_by('date_created')
        return [vars(ad) for ad in list(ads)]

    @staticmethod
    def add(user, data):
        new_adv = Advertisement(author=user, title=data['title'],
                                text=data['text'], lost=data['lost'], pet=data['pet'])
        new_adv.save()


class Feedback(models.Model):
    author = models.ForeignKey(User)
    adv = models.ForeignKey(Advertisement)
    text = models.CharField(max_length=256)
    contacts = models.CharField(max_length=128)


def generate_key():
    return "".join(random.choice(string.ascii_letters) for _ in range(64))


sessions = {}
