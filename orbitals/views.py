from django.shortcuts import render
from django.http import HttpResponse
from django.template.loader import render_to_string


def index(request):
    """Main page view"""
    context = {
        'title': 'Orbital Energy'
    }
    return render(request, 'index.html', context)


def tab_content(request, tab_name):
    """HTMX endpoint for tab content"""
    template_map = {
        'intro': 'orbitals/tabs/intro.html',
        'virialaos': 'orbitals/tabs/virialaos.html', 
        'canonicalaos': 'orbitals/tabs/canonicalaos.html',
        'graphs': 'orbitals/tabs/graphs.html',
        'references': 'orbitals/tabs/references.html',
    }
    
    template_name = template_map.get(tab_name)
    if not template_name:
        return HttpResponse('Invalid tab', status=404)
    
    html = render_to_string(template_name, request=request)
    return HttpResponse(html)
