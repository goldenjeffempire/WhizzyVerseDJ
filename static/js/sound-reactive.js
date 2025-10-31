// Sound-Reactive Visual Effects for WhizzyVerse
class SoundReactive {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = null;
        this.reactiveElements = [];
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        this.setupAudioContext();
        this.findReactiveElements();
        this.startVisualization();
    }
    
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            // Connect to existing audio element if available
            const audioElement = document.querySelector('audio');
            if (audioElement) {
                const source = this.audioContext.createMediaElementSource(audioElement);
                source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
                this.isInitialized = true;
            }
        } catch (error) {
            console.log('Audio context not available:', error);
        }
    }
    
    findReactiveElements() {
        // Find all elements with sound-reactive classes
        this.reactiveElements = document.querySelectorAll('[data-sound-reactive]');
    }
    
    startVisualization() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            if (!this.isInitialized || !this.analyser) return;
            
            this.analyser.getByteFrequencyData(this.dataArray);
            this.updateReactiveElements();
        };
        
        animate();
    }
    
    updateReactiveElements() {
        // Calculate average frequency
        const average = this.dataArray.reduce((a, b) => a + b, 0) / this.bufferLength;
        const bass = this.dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
        const treble = this.dataArray.slice(this.bufferLength - 10).reduce((a, b) => a + b, 0) / 10;
        
        this.reactiveElements.forEach(element => {
            const type = element.dataset.soundReactive;
            
            switch (type) {
                case 'glow':
                    this.updateGlow(element, average);
                    break;
                case 'scale':
                    this.updateScale(element, bass);
                    break;
                case 'color':
                    this.updateColor(element, average);
                    break;
                case 'bars':
                    this.updateBars(element);
                    break;
            }
        });
    }
    
    updateGlow(element, intensity) {
        const glowIntensity = Math.max(0.3, intensity / 255);
        const cyan = `rgba(0, 224, 255, ${glowIntensity})`;
        const purple = `rgba(122, 0, 255, ${glowIntensity * 0.8})`;
        element.style.boxShadow = `
            0 0 ${20 * glowIntensity}px ${cyan},
            0 0 ${40 * glowIntensity}px ${purple}
        `;
    }
    
    updateScale(element, intensity) {
        const scale = 1 + (intensity / 255) * 0.1;
        element.style.transform = `scale(${scale})`;
    }
    
    updateColor(element, intensity) {
        const hue = (intensity / 255) * 60 + 180; // 180-240 (cyan to purple range)
        element.style.color = `hsl(${hue}, 100%, 60%)`;
    }
    
    updateBars(container) {
        const bars = container.querySelectorAll('.sound-bar');
        const step = Math.floor(this.dataArray.length / bars.length);
        
        bars.forEach((bar, i) => {
            const value = this.dataArray[i * step];
            const height = (value / 255) * 100;
            bar.style.height = `${height}%`;
        });
    }
    
    createVisualizer(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        const draw = () => {
            requestAnimationFrame(draw);
            
            if (!this.isInitialized) return;
            
            this.analyser.getByteFrequencyData(this.dataArray);
            
            ctx.fillStyle = 'rgba(12, 12, 12, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = (canvas.width / this.bufferLength) * 2.5;
            let x = 0;
            
            for (let i = 0; i < this.bufferLength; i++) {
                const barHeight = (this.dataArray[i] / 255) * canvas.height;
                
                // Gradient from cyan to purple
                const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
                gradient.addColorStop(0, '#00E0FF');
                gradient.addColorStop(1, '#7A00FF');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        };
        
        draw();
    }
    
    createCircularVisualizer(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        const draw = () => {
            requestAnimationFrame(draw);
            
            if (!this.isInitialized) return;
            
            this.analyser.getByteFrequencyData(this.dataArray);
            
            ctx.fillStyle = 'rgba(12, 12, 12, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const bars = 64;
            const step = Math.floor(this.dataArray.length / bars);
            
            for (let i = 0; i < bars; i++) {
                const value = this.dataArray[i * step];
                const percent = value / 255;
                const barHeight = percent * 60;
                
                const angle = (i / bars) * Math.PI * 2;
                const x1 = centerX + Math.cos(angle) * radius;
                const y1 = centerY + Math.sin(angle) * radius;
                const x2 = centerX + Math.cos(angle) * (radius + barHeight);
                const y2 = centerY + Math.sin(angle) * (radius + barHeight);
                
                const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                gradient.addColorStop(0, `rgba(0, 224, 255, ${percent})`);
                gradient.addColorStop(1, `rgba(122, 0, 255, ${percent})`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        };
        
        draw();
    }
}

// Waveform Generator for Track Artwork
class WaveformGenerator {
    constructor() {
        this.waveforms = new Map();
    }
    
    async generateWaveform(audioUrl, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const response = await fetch(audioUrl);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            this.drawWaveform(audioBuffer, container);
        } catch (error) {
            console.error('Failed to generate waveform:', error);
            this.drawPlaceholderWaveform(container);
        }
    }
    
    drawWaveform(audioBuffer, container) {
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const data = audioBuffer.getChannelData(0);
        const step = Math.ceil(data.length / canvas.width);
        const amp = canvas.height / 2;
        
        ctx.fillStyle = '#0C0C0C';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#00E0FF');
        gradient.addColorStop(1, '#7A00FF');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < canvas.width; i++) {
            const min = Math.min(...data.slice(i * step, (i + 1) * step));
            const max = Math.max(...data.slice(i * step, (i + 1) * step));
            
            ctx.moveTo(i, (1 + min) * amp);
            ctx.lineTo(i, (1 + max) * amp);
        }
        
        ctx.stroke();
    }
    
    drawPlaceholderWaveform(container) {
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const amp = canvas.height / 2;
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#00E0FF');
        gradient.addColorStop(1, '#7A00FF');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < canvas.width; i++) {
            const y = amp + Math.sin(i * 0.05) * (amp * 0.3) + Math.random() * 20;
            if (i === 0) {
                ctx.moveTo(i, y);
            } else {
                ctx.lineTo(i, y);
            }
        }
        
        ctx.stroke();
    }
}

// Initialize sound reactive visuals
let soundReactive;
let waveformGenerator;

document.addEventListener('DOMContentLoaded', () => {
    soundReactive = new SoundReactive();
    waveformGenerator = new WaveformGenerator();
    
    // Create visualizers if containers exist
    if (document.getElementById('main-visualizer')) {
        soundReactive.createVisualizer('main-visualizer');
    }
    
    if (document.getElementById('circular-visualizer')) {
        soundReactive.createCircularVisualizer('circular-visualizer');
    }
});
