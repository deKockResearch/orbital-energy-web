from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from .calculations import calculate_element_energy


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


def calculate_energy(request):
    """API endpoint for orbital energy calculations"""
    atomic_number = request.GET.get('atomic_number', 8)  # Default to oxygen
    e_config = request.GET.get('e_config', '1s2 2s2 2p4')  # Default oxygen config
    
    try:
        atomic_number = int(atomic_number)
        result = calculate_element_energy(atomic_number, e_config)
        return JsonResponse(result)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
