class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrack = null;
        this.playlist = [];
        this.currentIndex = 0;
        this.canvas = null;
        this.canvasCtx = null;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.animationId = null;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.audio.addEventListener('ended', () => this.next());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    }

    async loadTrack(track, playlist = []) {
        this.currentTrack = track;
        this.playlist = playlist;
        this.currentIndex = playlist.findIndex(t => t.id === track.id);
        
        this.audio.src = track.file_url || track.audio_url;
        this.audio.load();
        
        this.updatePlayerUI();
        
        if (this.audioContext && this.canvas) {
            this.setupVisualizer();
        }
    }

    setupVisualizer() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            const source = this.audioContext.createMediaElementSource(this.audio);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        }

        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        
        this.visualize();
    }

    visualize() {
        if (!this.canvas || !this.canvasCtx) return;
        
        const draw = () => {
            this.animationId = requestAnimationFrame(draw);
            
            this.analyser.getByteFrequencyData(this.dataArray);
            
            const width = this.canvas.width;
            const height = this.canvas.height;
            
            this.canvasCtx.fillStyle = 'rgb(12, 12, 12)';
            this.canvasCtx.fillRect(0, 0, width, height);
            
            const barWidth = (width / this.dataArray.length) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < this.dataArray.length; i++) {
                barHeight = (this.dataArray[i] / 255) * height;
                
                const gradient = this.canvasCtx.createLinearGradient(0, height - barHeight, 0, height);
                gradient.addColorStop(0, '#7A00FF');
                gradient.addColorStop(0.5, '#00E0FF');
                gradient.addColorStop(1, '#7A00FF');
                
                this.canvasCtx.fillStyle = gradient;
                this.canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        };
        
        draw();
    }

    play() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.audio.play();
        this.isPlaying = true;
        this.dispatchEvent('play');
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.dispatchEvent('pause');
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    next() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadTrack(this.playlist[this.currentIndex], this.playlist);
        this.play();
    }

    previous() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.playlist[this.currentIndex], this.playlist);
        this.play();
    }

    seek(percentage) {
        const time = (percentage / 100) * this.audio.duration;
        this.audio.currentTime = time;
    }

    setVolume(percentage) {
        this.audio.volume = percentage / 100;
    }

    updateProgress() {
        const percentage = (this.audio.currentTime / this.audio.duration) * 100;
        this.dispatchEvent('progress', {
            current: this.formatTime(this.audio.currentTime),
            duration: this.formatTime(this.audio.duration),
            percentage: percentage || 0
        });
    }

    updateDuration() {
        this.dispatchEvent('loaded', {
            duration: this.formatTime(this.audio.duration)
        });
    }

    updatePlayerUI() {
        this.dispatchEvent('trackChanged', this.currentTrack);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
    }

    dispatchEvent(eventName, data = null) {
        window.dispatchEvent(new CustomEvent(`musicPlayer:${eventName}`, { detail: data }));
    }

    async incrementPlayCount(trackId) {
        try {
            const csrftoken = this.getCookie('csrftoken');
            await fetch(`/api/tracks/${trackId}/play/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                }
            });
        } catch (error) {
            console.error('Error incrementing play count:', error);
        }
    }

    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    destroy() {
        this.pause();
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

const musicPlayer = new MusicPlayer();
