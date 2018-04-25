from django.contrib.auth.models import User
from django.db import models
import random
import string
from django.core.mail import send_mail
from lu_pet.settings import EMAIL_HOST_USER


class SessionManager(models.Manager):
    @staticmethod
    def authentificate(username, password):
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            if user.check_password(password):
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


def add_user(username, password, email, allow_dispatch):
    user = User.objects.create_user(username=username, password=password, email=email)
    user.save()
    disp = Dispatch.objects.create(allow=allow_dispatch, user=user)
    disp.save()


class Dispatch(models.Model):
    allow = models.BooleanField(default=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)


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
        ads = ads.filter(**filters_dict).order_by('date_created')
        res = []
        for ad in list(ads)[::-1]:
            ad_dict = vars(ad)
            del ad_dict['_state']
            del ad_dict['date_created']
            res.append(ad_dict)
        return res

    @staticmethod
    def add(user, data, img):
        adv = Advertisement.objects.create(author=user, text=data['text'], type=data['type'],
                                           pet=data['pet'], district=data['district'], name=data['name'])
        adv.save()
        with open('frontend/Frontend/www/assets/images/{}.jpg'.format(adv.pk), 'wb+') as destination:
            for chunk in img.chunks():
                destination.write(chunk)


class Feedback(models.Model):
    adv = models.ForeignKey(Advertisement, on_delete=models.CASCADE)
    text = models.CharField(max_length=256)
    contacts = models.CharField(max_length=128)

    @staticmethod
    def add(text, contacts, adv_id):
        ad = Advertisement.objects.get(pk=adv_id)
        adv_author = ad.author
        fb = Feedback.objects.create(text=text, contacts=contacts, adv=ad)
        fb.save()
        if Dispatch.objects.get(user=adv_author).allow:
            send_mail('Відгук на обʼяву про тваринку  {}'.format(ad.name),
                      '{0}\n Контакти: {1}'.format(text, contacts), EMAIL_HOST_USER,
                      [adv_author.email], fail_silently=False)


def generate_key():
    return "".join(random.choice(string.ascii_letters) for _ in range(64))


sessions = {}
