// Analytics Dashboard Charts for DJ Whizzy
class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.data = null;
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.createCharts();
        this.updateStats();
    }
    
    async loadData() {
        try {
            const response = await fetch('/api/analytics/summary/');
            this.data = await response.json();
        } catch (error) {
            console.error('Failed to load analytics data:', error);
            this.data = this.getDefaultData();
        }
    }
    
    getDefaultData() {
        return {
            total_track_plays: 52340,
            total_chat_sessions: 1250,
            total_merch_views: 8900,
            total_event_rsvps: 450,
            track_plays_trend: [120, 180, 250, 320, 410, 500, 620],
            chat_sessions_trend: [15, 25, 35, 45, 60, 75, 90],
            popular_genres: {
                'Afrobeats': 45,
                'Electronic': 30,
                'Hip-Hop': 15,
                'Fusion': 10
            },
            engagement_by_day: {
                'Mon': 850,
                'Tue': 920,
                'Wed': 1100,
                'Thu': 980,
                'Fri': 1350,
                'Sat': 1680,
                'Sun': 1420
            }
        };
    }
    
    createCharts() {
        this.createTrackPlaysChart();
        this.createGenreDistributionChart();
        this.createEngagementChart();
        this.createChatSessionsChart();
    }
    
    createTrackPlaysChart() {
        const ctx = document.getElementById('trackPlaysChart');
        if (!ctx) return;
        
        this.charts.trackPlays = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Track Plays',
                    data: this.data.track_plays_trend,
                    borderColor: '#00E0FF',
                    backgroundColor: 'rgba(0, 224, 255, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#00E0FF',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 8,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 10, 0.9)',
                        borderColor: '#00E0FF',
                        borderWidth: 1,
                        titleColor: '#00E0FF',
                        bodyColor: '#fff',
                        padding: 12,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 224, 255, 0.1)'
                        },
                        ticks: {
                            color: '#999'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 224, 255, 0.05)'
                        },
                        ticks: {
                            color: '#999'
                        }
                    }
                }
            }
        });
    }
    
    createGenreDistributionChart() {
        const ctx = document.getElementById('genreChart');
        if (!ctx) return;
        
        const genres = Object.keys(this.data.popular_genres);
        const values = Object.values(this.data.popular_genres);
        
        this.charts.genres = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: genres,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'rgba(0, 224, 255, 0.8)',
                        'rgba(122, 0, 255, 0.8)',
                        'rgba(255, 0, 127, 0.8)',
                        'rgba(0, 255, 157, 0.8)'
                    ],
                    borderColor: '#0C0C0C',
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#fff',
                            padding: 15,
                            font: {
                                size: 12
                            },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 10, 0.9)',
                        borderColor: '#00E0FF',
                        borderWidth: 1,
                        titleColor: '#00E0FF',
                        bodyColor: '#fff',
                        padding: 12
                    }
                }
            }
        });
    }
    
    createEngagementChart() {
        const ctx = document.getElementById('engagementChart');
        if (!ctx) return;
        
        const days = Object.keys(this.data.engagement_by_day);
        const engagement = Object.values(this.data.engagement_by_day);
        
        this.charts.engagement = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'User Engagement',
                    data: engagement,
                    backgroundColor: 'rgba(122, 0, 255, 0.6)',
                    borderColor: '#7A00FF',
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: 'rgba(0, 224, 255, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 10, 0.9)',
                        borderColor: '#7A00FF',
                        borderWidth: 1,
                        titleColor: '#7A00FF',
                        bodyColor: '#fff',
                        padding: 12
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(122, 0, 255, 0.1)'
                        },
                        ticks: {
                            color: '#999'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#999'
                        }
                    }
                }
            }
        });
    }
    
    createChatSessionsChart() {
        const ctx = document.getElementById('chatSessionsChart');
        if (!ctx) return;
        
        this.charts.chatSessions = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'WhizBot Sessions',
                    data: this.data.chat_sessions_trend,
                    borderColor: '#7A00FF',
                    backgroundColor: 'rgba(122, 0, 255, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#7A00FF',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 8,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 10, 0.9)',
                        borderColor: '#7A00FF',
                        borderWidth: 1,
                        titleColor: '#7A00FF',
                        bodyColor: '#fff',
                        padding: 12
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(122, 0, 255, 0.1)'
                        },
                        ticks: {
                            color: '#999'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(122, 0, 255, 0.05)'
                        },
                        ticks: {
                            color: '#999'
                        }
                    }
                }
            }
        });
    }
    
    updateStats() {
        // Update stat cards
        const stats = {
            'total-plays': this.formatNumber(this.data.total_track_plays),
            'total-chats': this.formatNumber(this.data.total_chat_sessions),
            'total-views': this.formatNumber(this.data.total_merch_views),
            'total-rsvps': this.formatNumber(this.data.total_event_rsvps)
        };
        
        Object.keys(stats).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                this.animateNumber(element, stats[key]);
            }
        });
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    animateNumber(element, target) {
        const duration = 1000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    refreshData() {
        this.loadData().then(() => {
            Object.values(this.charts).forEach(chart => {
                if (chart) chart.destroy();
            });
            this.createCharts();
            this.updateStats();
        });
    }
}

// Initialize analytics dashboard
let analyticsDashboard;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('trackPlaysChart')) {
        analyticsDashboard = new AnalyticsDashboard();
        
        // Auto-refresh every 30 seconds
        setInterval(() => {
            if (analyticsDashboard) {
                analyticsDashboard.refreshData();
            }
        }, 30000);
    }
});
