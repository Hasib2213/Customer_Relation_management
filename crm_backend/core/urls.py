from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'opportunities', OpportunityViewSet)
router.register(r'interactions', InteractionViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'customfields', CustomFieldViewSet)
router.register(r'emailtemplates', EmailTemplateViewSet)
router.register(r'workflowtriggers', WorkflowTriggerViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    
]