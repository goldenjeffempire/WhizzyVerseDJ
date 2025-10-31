// Advanced Music Filters and AI Recommendations for DJ Whizzy
class MusicFilters {
    constructor() {
        this.tracks = [];
        this.filteredTracks = [];
        this.activeFilters = {
            genre: 'all',
            mood: 'all',
            tempo: 'all',
            search: ''
        };
        this.init();
    }
    
    init() {
        this.loadTracks();
        this.attachEventListeners();
    }
    
    async loadTracks() {
        try {
            const response = await fetch('/api/tracks/all/');
            const data = await response.json();
            this.tracks = data.tracks || [];
            this.filteredTracks = [...this.tracks];
            this.renderTracks();
        } catch (error) {
            console.error('Failed to load tracks:', error);
        }
    }
    
    attachEventListeners() {
        // Genre filter
        const genreFilter = document.getElementById('genre-filter');
        if (genreFilter) {
            genreFilter.addEventListener('change', (e) => {
                this.activeFilters.genre = e.target.value;
                this.applyFilters();
            });
        }
        
        // Mood filter
        const moodFilter = document.getElementById('mood-filter');
        if (moodFilter) {
            moodFilter.addEventListener('change', (e) => {
                this.activeFilters.mood = e.target.value;
                this.applyFilters();
            });
        }
        
        // Tempo filter
        const tempoFilter = document.getElementById('tempo-filter');
        if (tempoFilter) {
            tempoFilter.addEventListener('change', (e) => {
                this.activeFilters.tempo = e.target.value;
                this.applyFilters();
            });
        }
        
        // Search
        const searchInput = document.getElementById('track-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.activeFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
        
        // Sort options
        const sortSelect = document.getElementById('sort-tracks');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortTracks(e.target.value);
            });
        }
    }
    
    applyFilters() {
        this.filteredTracks = this.tracks.filter(track => {
            // Genre filter
            if (this.activeFilters.genre !== 'all' && track.genre !== this.activeFilters.genre) {
                return false;
            }
            
            // Mood filter
            if (this.activeFilters.mood !== 'all' && track.mood !== this.activeFilters.mood) {
                return false;
            }
            
            // Tempo filter
            if (this.activeFilters.tempo !== 'all') {
                const bpm = track.bpm || 0;
                switch (this.activeFilters.tempo) {
                    case 'slow':
                        if (bpm >= 100) return false;
                        break;
                    case 'medium':
                        if (bpm < 100 || bpm >= 140) return false;
                        break;
                    case 'fast':
                        if (bpm < 140) return false;
                        break;
                }
            }
            
            // Search filter
            if (this.activeFilters.search) {
                const searchTerm = this.activeFilters.search;
                return track.title.toLowerCase().includes(searchTerm) ||
                       track.artist.toLowerCase().includes(searchTerm) ||
                       track.genre.toLowerCase().includes(searchTerm);
            }
            
            return true;
        });
        
        this.renderTracks();
        this.updateFilterCount();
    }
    
    sortTracks(sortBy) {
        switch (sortBy) {
            case 'newest':
                this.filteredTracks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'popular':
                this.filteredTracks.sort((a, b) => b.plays - a.plays);
                break;
            case 'title':
                this.filteredTracks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'bpm':
                this.filteredTracks.sort((a, b) => a.bpm - b.bpm);
                break;
        }
        this.renderTracks();
    }
    
    renderTracks() {
        const container = document.getElementById('tracks-container');
        if (!container) return;
        
        if (this.filteredTracks.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <div class="text-gray-400 text-xl mb-4">No tracks match your filters</div>
                    <button onclick="musicFilters.clearFilters()" class="gradient-bg px-6 py-3 rounded-full font-bold hover-glow-intense transition-smooth">
                        Clear Filters
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredTracks.map(track => this.renderTrackCard(track)).join('');
    }
    
    renderTrackCard(track) {
        return `
            <div class="glass-card rounded-2xl overflow-hidden hover-lift transition-smooth group">
                <div class="relative overflow-hidden">
                    <img src="${track.artwork}" alt="${track.title}" class="w-full h-64 object-cover group-hover:scale-110 transition-smooth">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-6">
                        <button onclick="playTrack(${track.id})" class="btn-pulse gradient-bg px-6 py-3 rounded-full font-bold w-full">
                            <svg class="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                            </svg>
                            Play Now
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="font-heading text-xl font-bold mb-2">${track.title}</h3>
                    <p class="text-gray-400 mb-3">${track.artist}</p>
                    <div class="flex items-center justify-between text-sm mb-4">
                        <span class="text-neon-cyan">${track.genre}</span>
                        <span class="text-gray-500">${track.bpm} BPM</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-400 text-sm">${this.formatPlays(track.plays)} plays</span>
                        <div class="flex gap-2">
                            <button onclick="favoriteTrack(${track.id})" class="text-gray-400 hover:text-neon-cyan transition-smooth">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                </svg>
                            </button>
                            <button onclick="shareTrack(${track.id})" class="text-gray-400 hover:text-neon-cyan transition-smooth">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    formatPlays(plays) {
        if (plays >= 1000000) {
            return (plays / 1000000).toFixed(1) + 'M';
        } else if (plays >= 1000) {
            return (plays / 1000).toFixed(1) + 'K';
        }
        return plays.toString();
    }
    
    updateFilterCount() {
        const counter = document.getElementById('filter-count');
        if (counter) {
            counter.textContent = `${this.filteredTracks.length} of ${this.tracks.length} tracks`;
        }
    }
    
    clearFilters() {
        this.activeFilters = {
            genre: 'all',
            mood: 'all',
            tempo: 'all',
            search: ''
        };
        
        // Reset UI elements
        const genreFilter = document.getElementById('genre-filter');
        const moodFilter = document.getElementById('mood-filter');
        const tempoFilter = document.getElementById('tempo-filter');
        const searchInput = document.getElementById('track-search');
        
        if (genreFilter) genreFilter.value = 'all';
        if (moodFilter) moodFilter.value = 'all';
        if (tempoFilter) tempoFilter.value = 'all';
        if (searchInput) searchInput.value = '';
        
        this.applyFilters();
    }
}

// AI-Powered Track Recommendations
class AIRecommendations {
    constructor() {
        this.recommendations = [];
    }
    
    async getRecommendations(trackId) {
        try {
            const response = await fetch(`/api/tracks/${trackId}/recommendations/`);
            const data = await response.json();
            this.recommendations = data.recommendations || [];
            this.renderRecommendations();
        } catch (error) {
            console.error('Failed to load recommendations:', error);
            this.showFallbackRecommendations();
        }
    }
    
    renderRecommendations() {
        const container = document.getElementById('recommendations-container');
        if (!container || this.recommendations.length === 0) return;
        
        container.innerHTML = `
            <div class="mt-12">
                <h3 class="font-heading text-2xl font-bold mb-6 text-neon-cyan">
                    🤖 AI Recommended for You
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${this.recommendations.map(track => this.renderRecommendationCard(track)).join('')}
                </div>
            </div>
        `;
    }
    
    renderRecommendationCard(track) {
        return `
            <div class="glass-card rounded-xl p-4 hover-lift transition-smooth">
                <div class="flex gap-4">
                    <img src="${track.artwork}" alt="${track.title}" class="w-20 h-20 rounded-lg object-cover">
                    <div class="flex-1">
                        <h4 class="font-bold mb-1">${track.title}</h4>
                        <p class="text-sm text-gray-400 mb-2">${track.artist}</p>
                        <button onclick="playTrack(${track.id})" class="text-neon-cyan text-sm font-bold hover:text-electric-purple transition-smooth">
                            Play →
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    showFallbackRecommendations() {
        // Show popular tracks as fallback
        console.log('Showing fallback recommendations');
    }
}

// Share functionality
function shareTrack(trackId) {
    const shareData = {
        title: 'Check out this track from DJ Whizzy!',
        text: 'Listen to this amazing track on WhizzyVerse',
        url: window.location.origin + `/music/track/${trackId}/`
    };
    
    if (navigator.share) {
        navigator.share(shareData).catch(err => console.log('Share cancelled'));
    } else {
        // Fallback - Copy to clipboard
        const url = shareData.url;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!');
        });
    }
}

// Notification helper
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-20 right-4 glass-card px-6 py-4 rounded-full z-50 animate-fadeIn';
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-neon-cyan" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="font-bold">${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize filters when DOM is ready
let musicFilters;
let aiRecommendations;

document.addEventListener('DOMContentLoaded', () => {
    musicFilters = new MusicFilters();
    aiRecommendations = new AIRecommendations();
});
