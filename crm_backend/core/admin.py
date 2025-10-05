from django.contrib import admin
from .models import Company, Opportunity

# Register your models here.
from .models import Contact
admin.site.register(Contact)
admin.site.register(Company)
admin.site.register(Opportunity)


