from django.contrib.auth.models import User
from django.db import models
import random
import string


class SessionManager(models.Manager):
    @staticmethod
    def authentificate(username, password):
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            if user.check_password(password):
                print('checked')
                session = Session()
                session.user = user
                session.key = "".join(random.choice(string.ascii_letters) for _ in range(64))
                session.save()
                return session.key
        return None

    @staticmethod
    def exit(session):
        session.delete()


class Session(models.Model):
    key = models.CharField(unique=True, max_length=64)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    objects = SessionManager()


def add_user(username, password):
    user = User.objects.create_user(username=username, password=password)
    user.save()


class Advertisement(models.Model):
    class Meta:
        app_label = 'lu_pet'

    DOG = 0
    CAT = 1
    OTHER = 2
    PET_CHOICES = (
        (DOG, 'Dog'),
        (CAT, 'Cat'),
        (OTHER, 'Other')
    )
    LOST = 0
    FOUND = 1
    HANDS = 2
    TYPE_CHOICES = (
        (LOST, 'Lost'),
        (FOUND, 'Found'),
        (HANDS, 'Good hands')
    )
    name = models.CharField(max_length=16, default='Tuzick')
    type = models.SmallIntegerField(choices=TYPE_CHOICES, default=LOST)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    pet = models.SmallIntegerField(choices=PET_CHOICES, default=OTHER)
    text = models.CharField(max_length=500)
    date_created = models.DateField(auto_now=True)
    district = models.CharField(max_length=32)

    @staticmethod
    def ads_info(filters_dict):
        ads = Advertisement.objects.all()
        ads.filter(**filters_dict).order_by('date_created')
        res = []
        for ad in list(ads):
            ad_dict = vars(ad)
            del ad_dict['_state']
            del ad_dict['date_created']
            res.append(ad_dict)
        return res

    @staticmethod
    def add(user, data):
        adv = Advertisement.objects.create(author=user, text=data['text'], type=data['type'],
                                           pet=data['pet'], district=data['district'], name=data['name'])
        adv.save()


class Feedback(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    adv = models.ForeignKey(Advertisement, on_delete=models.CASCADE)
    text = models.CharField(max_length=256)
    contacts = models.CharField(max_length=128)


def generate_key():
    return "".join(random.choice(string.ascii_letters) for _ in range(64))


sessions = {}
