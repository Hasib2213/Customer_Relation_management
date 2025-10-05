from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Sum
from .models import *
from .serializers import *
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated,AllowAny    



class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer

class InteractionViewSet(viewsets.ModelViewSet):
    queryset = Interaction.objects.all()
    serializer_class = InteractionSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class CustomFieldViewSet(viewsets.ModelViewSet):
    queryset = CustomField.objects.all()
    serializer_class = CustomFieldSerializer

class EmailTemplateViewSet(viewsets.ModelViewSet):
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer

class WorkflowTriggerViewSet(viewsets.ModelViewSet):
    queryset = WorkflowTrigger.objects.all()
    serializer_class = WorkflowTriggerSerializer

class DashboardView(APIView):
     # Allow any user (authenticated or not) to access this view
    def get(self, request):
        data = {
            'total_contacts': Contact.objects.count(),
            'total_leads': Contact.objects.filter(status='lead').count(),
            'total_clients': Contact.objects.filter(status='client').count(),
            'leads_by_stage': list(Opportunity.objects.values('stage').annotate(count=Count('id'))),
            'open_opportunities_value': Opportunity.objects.exclude(stage__in=['closed_won', 'closed_lost']).aggregate(total=Sum('deal_value'))['total'] or 0,
            'recent_interactions': list(Interaction.objects.order_by('-date')[:10].values('date', 'type', 'subject', 'summary')),
        }
        return Response(data)
    

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer    


