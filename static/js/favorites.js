class FavoritesManager {
    constructor() {
        this.storageKey = 'whizzyverse_favorites';
        this.favorites = this.loadFavorites();
    }

    loadFavorites() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : { tracks: [], events: [], merch: [] };
        } catch (error) {
            console.error('Error loading favorites:', error);
            return { tracks: [], events: [], merch: [] };
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    isFavorite(type, id) {
        return this.favorites[type]?.includes(id) || false;
    }

    toggleFavorite(type, id) {
        if (!this.favorites[type]) {
            this.favorites[type] = [];
        }

        const index = this.favorites[type].indexOf(id);
        if (index > -1) {
            this.favorites[type].splice(index, 1);
        } else {
            this.favorites[type].push(id);
        }

        this.saveFavorites();
        this.dispatchChangeEvent();
        return this.isFavorite(type, id);
    }

    getFavorites(type) {
        return this.favorites[type] || [];
    }

    getAllFavorites() {
        return this.favorites;
    }

    getCount(type) {
        return this.favorites[type]?.length || 0;
    }

    getTotalCount() {
        return this.getCount('tracks') + this.getCount('events') + this.getCount('merch');
    }

    clearAll() {
        this.favorites = { tracks: [], events: [], merch: [] };
        this.saveFavorites();
        this.dispatchChangeEvent();
    }

    dispatchChangeEvent() {
        window.dispatchEvent(new CustomEvent('favoritesChanged', {
            detail: this.favorites
        }));
    }
}

const favoritesManager = new FavoritesManager();

function favoriteButton(type, id) {
    return {
        isFavorite: favoritesManager.isFavorite(type, id),
        toggle() {
            this.isFavorite = favoritesManager.toggleFavorite(type, id);
        },
        init() {
            window.addEventListener('favoritesChanged', () => {
                this.isFavorite = favoritesManager.isFavorite(type, id);
            });
        }
    }
}

function favoritesPage() {
    return {
        activeTab: 'tracks',
        loading: true,
        favoriteData: { tracks: [], events: [], merch: [] },
        tracks: [],
        events: [],
        merch: [],
        totalCount: 0,

        init() {
            this.loadFavorites();
            window.addEventListener('favoritesChanged', () => {
                this.loadFavorites();
            });
        },

        async loadFavorites() {
            this.loading = true;
            
            const favorites = favoritesManager.getAllFavorites();
            this.favoriteData = favorites;
            this.totalCount = favoritesManager.getTotalCount();

            try {
                if (favorites.tracks.length > 0) {
                    const response = await fetch('/api/tracks/');
                    const allTracks = await response.json();
                    this.tracks = allTracks.filter(t => favorites.tracks.includes(t.id));
                }

                if (favorites.events.length > 0) {
                    const response = await fetch('/api/events/');
                    const allEvents = await response.json();
                    this.events = allEvents.filter(e => favorites.events.includes(e.id));
                }

                if (favorites.merch.length > 0) {
                    const response = await fetch('/api/merch/');
                    const allMerch = await response.json();
                    this.merch = allMerch.filter(m => favorites.merch.includes(m.id));
                }
            } catch (error) {
                console.error('Error loading favorites:', error);
            } finally {
                this.loading = false;
            }
        },

        clearAllFavorites() {
            if (confirm('Are you sure you want to clear all favorites?')) {
                favoritesManager.clearAll();
                this.loadFavorites();
            }
        },

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
        }
    }
}
