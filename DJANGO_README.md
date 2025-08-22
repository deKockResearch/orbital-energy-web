# Django Setup Instructions

This project has been ported from Astro to Django with AJAX-based functionality.

## Setup

1. Create a virtual environment:
```bash
python3 -m venv django_env
source django_env/bin/activate  # On Windows: django_env\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start the development server:
```bash
python manage.py runserver
```

5. Open http://localhost:8000 in your browser

## Features

- Interactive tab navigation with AJAX content loading
- Real-time orbital energy calculations
- Python backend calculations matching original TypeScript algorithms
- Responsive design preserved from original Astro application

## API Endpoints

- `/` - Main application interface
- `/orbitals/tab/<tab_name>/` - AJAX endpoints for tab content
- `/orbitals/calculate/` - Orbital energy calculation API

## Usage

Navigate to the "Canonical AOs" tab to use the orbital energy calculator. Enter an atomic number and electron configuration to get real-time energy calculations.