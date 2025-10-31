# WhizzyVerse - AI-Powered Personal DJ Brand Platform

**Tagline:** *Step into the Sound Dimension*

WhizzyVerse is a complete, interactive platform for DJ Whizzy - featuring music library, events showcase, merch store, and an AI-powered chatbot assistant. Built with Django full-stack architecture, this demo-ready platform showcases the fusion of sound, AI, and visual artistry.

---

## 🌌 Platform Overview

- **Platform Name:** WhizzyVerse
- **Identity:** A fusion of sound, AI, and visual artistry
- **Purpose:** Showcase DJ Whizzy's music, events, and merch with immersive fan interaction
- **Target:** Demo-ready prototype for client showcasing

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- pip or uv package manager

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies:**
```bash
pip install django djangorestframework django-cors-headers openai python-dotenv Pillow gunicorn
# Or with uv:
uv add django djangorestframework django-cors-headers openai python-dotenv Pillow gunicorn
```

3. **Run migrations:**
```bash
python manage.py migrate
```

4. **Load seed data:**
```bash
python manage.py load_seed_data
```

5. **Create a superuser (optional):**
```bash
python manage.py createsuperuser
```

6. **Run the development server:**
```bash
python manage.py runserver 0.0.0.0:5000
```

7. **Access the platform:**
- Main site: http://localhost:5000
- Django Admin: http://localhost:5000/admin
- Admin Dashboard: http://localhost:5000/admin-demo

---

## 📦 Project Structure

```
whizzyverse/
├── whizzyverse/              # Main Django project
│   ├── tracks/               # Music library app
│   ├── events/               # Events/shows app
│   ├── merch/                # Merchandise store app
│   ├── analytics/            # Analytics & metrics app
│   ├── core/                 # Core functionality & landing page
│   └── ai_connector/         # WhizBot AI assistant
├── templates/                # Django templates
│   ├── base.html            # Base template with navigation & chat
│   ├── core/                # Landing page template
│   ├── tracks/              # Music library template
│   ├── events/              # Events page template
│   ├── merch/               # Merch store template
│   └── analytics/           # Admin dashboard template
├── seed/                     # Demo data JSON files
│   ├── whizzy_tracks.json
│   ├── whizzy_events.json
│   ├── whizzy_merch.json
│   └── whizzy_persona.json
└── brand_assets/            # Brand identity documentation
    └── README.md            # Complete brand guidelines
```

---

## 🎨 Features

### 🎵 Music Library
- Browse DJ Whizzy's complete track collection
- View track details: genre, BPM, duration, play count
- Featured tracks showcase
- Responsive card-based layout with hover effects

### 📅 Events
- Upcoming shows with full details (date, venue, city, pricing)
- Past events archive
- Ticket purchase integration (mock)
- High-quality event banners and visuals

### 🛍️ Merch Store
- Complete product catalog
- Category filtering (apparel, accessories, music, collectibles)
- Stock tracking and availability status
- Featured items showcase
- Mock checkout functionality

### 🤖 WhizBot AI Assistant
- Floating chat widget on all pages
- AI-powered responses using OpenAI GPT-4
- DJ Whizzy persona with confident, modern tone
- Knowledge base about tracks, events, and merch
- Graceful fallback when OpenAI API key is not configured

### 📊 Admin Dashboard
- Real-time analytics and metrics
- Track plays, chat sessions, fan count
- Page view statistics
- Music library overview
- Engagement metrics visualization

---

## 🔌 API Endpoints

### REST API
- `GET /api/tracks/` - List all tracks
- `GET /api/tracks/{id}/` - Track details
- `POST /api/tracks/{id}/play/` - Increment play count
- `GET /api/events/` - List all events
- `GET /api/events/{id}/` - Event details
- `GET /api/merch/` - List all merch items
- `GET /api/merch/{id}/` - Merch item details
- `GET /api/analytics/` - Analytics data
- `GET /api/analytics/summary/` - Analytics summary
- `POST /api/chat/` - Chat with WhizBot AI

---

## 🎨 Brand Identity

### Color Palette
- **Neon Cyan:** `#00E0FF` - Electric energy, digital vibes
- **Electric Purple:** `#7A00FF` - Creative power, musical depth
- **Midnight Black:** `#0C0C0C` - Premium background
- **Pure White:** `#FFFFFF` - Clarity and contrast

### Typography
- **Headings:** Orbitron (futuristic, bold)
- **Body:** Inter (clean, modern, readable)

### Visual Style
- Dark neon cyberpunk theme
- Animated glow effects on hover
- Smooth transitions and micro-interactions
- Music-reactive visual elements

See complete brand guidelines in `/brand_assets/README.md`

---

## 🤖 WhizBot Configuration

WhizBot uses OpenAI's GPT-4 for intelligent conversations. To enable full AI functionality:

1. **Get an OpenAI API key:**
   - Sign up at https://platform.openai.com
   - Create an API key in your dashboard

2. **Set the environment variable:**
```bash
export OPENAI_API_KEY='your-api-key-here'
```

3. **Restart the server**

**Note:** WhizBot will work in "offline mode" without an API key, providing helpful fallback messages.

---

## 📊 Seed Data

The platform comes with comprehensive demo data:
- **8 Tracks** across multiple genres (Electronic, House, Techno, Trance, etc.)
- **6 Events** (3 upcoming, 3 past)
- **9 Merch Items** across all categories
- **Analytics data** with realistic engagement metrics
- **WhizBot persona** with conversation examples

To reload seed data at any time:
```bash
python manage.py load_seed_data
```

---

## 🛠️ Tech Stack

- **Backend:** Django 5.2.7
- **API:** Django REST Framework 3.16.1
- **Database:** SQLite (development)
- **AI:** OpenAI GPT-4 integration
- **Frontend:** Django Templates
- **CSS:** TailwindCSS (CDN)
- **JavaScript:** Alpine.js for interactivity
- **Fonts:** Google Fonts (Orbitron, Inter)

---

## 📱 Pages Overview

### Landing Page (`/`)
- Hero section with animated glow effects
- Featured tracks carousel
- Upcoming events preview
- Featured merch showcase
- Call-to-action buttons

### Music Library (`/music/`)
- Complete track listing
- Filterable by genre
- Play count tracking
- Audio player integration ready

### Events (`/events/`)
- Upcoming shows with full details
- Past events archive
- Ticket purchase CTAs
- Event banners and descriptions

### Merch Store (`/merch/`)
- Product catalog with images
- Category badges
- Stock status indicators
- Mock add-to-cart functionality

### Admin Dashboard (`/admin-demo/`)
- Analytics visualization
- Engagement metrics
- Platform statistics
- Music library stats

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
DJANGO_SECRET_KEY=whizzyverse_secret_key_for_demo
OPENAI_API_KEY=your_openai_api_key_here
DEBUG=True
```

---

## 🎯 Demo Flow (For Client Presentation)

1. **Load homepage** → Immersive hero with neon animations
2. **Chat with WhizBot** → AI responds in DJ Whizzy's voice
3. **Explore Music Library** → Browse tracks with dynamic visuals
4. **Check Merch Store** → View products and mock checkout
5. **Visit Events** → Upcoming and past shows
6. **Admin Dashboard** → View analytics and fan metrics

---

## 🚢 Deployment Notes

This is a **development-ready** Django application. For production deployment:

1. Set `DEBUG=False` in settings
2. Configure proper `ALLOWED_HOSTS`
3. Use a production-grade database (PostgreSQL recommended)
4. Set up static file serving with WhiteNoise or CDN
5. Use a production WSGI server (Gunicorn, uWSGI)
6. Enable HTTPS and configure security settings

Example production command:
```bash
gunicorn --bind 0.0.0.0:8000 --reuse-port whizzyverse.wsgi:application
```

---

## 📝 Management Commands

### Load Seed Data
```bash
python manage.py load_seed_data
```
Loads all demo tracks, events, merch items, and analytics data.

### Create Superuser
```bash
python manage.py createsuperuser
```
Creates an admin account for Django admin access.

### Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```
Creates and applies database migrations.

---

## 🎨 Customization

### Adding New Tracks
1. Access Django Admin (`/admin`)
2. Navigate to Tracks
3. Click "Add Track"
4. Fill in details (title, genre, BPM, artwork URL, etc.)
5. Save and the track appears immediately

### Modifying WhizBot Persona
Edit `/seed/whizzy_persona.json` to customize:
- Personality traits
- Speaking style
- Knowledge base
- System prompt
- Conversation examples

### Brand Colors
Modify in `templates/base.html`:
```javascript
colors: {
  'neon-cyan': '#00E0FF',
  'electric-purple': '#7A00FF',
  'midnight-black': '#0C0C0C',
}
```

---

## 🐛 Troubleshooting

### Server won't start
- Ensure all dependencies are installed
- Check that port 5000 is not in use
- Verify migrations are applied: `python manage.py migrate`

### WhizBot not responding
- Check that OPENAI_API_KEY is set correctly
- Verify API key is valid at https://platform.openai.com
- WhizBot will work in offline mode without a key

### Database errors
- Delete `db.sqlite3` and re-run migrations
- Reload seed data: `python manage.py load_seed_data`

### Static files not loading
- Ensure STATIC_URL is set correctly in settings
- Run `python manage.py collectstatic` if needed

---

## 📄 License

This is a demo project created for WhizzyVerse brand showcase.

---

## 🎧 Contact & Support

For questions about DJ Whizzy or WhizzyVerse:
- Chat with WhizBot on the platform
- Visit the Admin Dashboard for analytics
- Check out the brand guidelines in `/brand_assets/`

---

**Built with Django, AI, and a whole lot of beats.** 🎵✨

*WhizzyVerse - Step into the Sound Dimension*
