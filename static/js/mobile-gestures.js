// Mobile Touch Gestures and Swipe Navigation for WhizzyVerse
class MobileGestures {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;
        this.init();
    }
    
    init() {
        if (!this.isTouchDevice()) return;
        
        this.setupSwipeNavigation();
        this.setupPullToRefresh();
        this.setupDoubleTapToLike();
        this.setupLongPressActions();
    }
    
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    setupSwipeNavigation() {
        const swipeableElements = document.querySelectorAll('[data-swipe-nav]');
        
        swipeableElements.forEach(element => {
            element.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
                this.touchStartY = e.changedTouches[0].screenY;
            });
            
            element.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.touchEndY = e.changedTouches[0].screenY;
                this.handleSwipe(element);
            });
        });
    }
    
    handleSwipe(element) {
        const diffX = this.touchEndX - this.touchStartX;
        const diffY = this.touchEndY - this.touchStartY;
        const absDiffX = Math.abs(diffX);
        const absDiffY = Math.abs(diffY);
        
        // Only trigger if horizontal swipe is dominant
        if (absDiffX > absDiffY && absDiffX > this.minSwipeDistance) {
            if (diffX > 0) {
                this.onSwipeRight(element);
            } else {
                this.onSwipeLeft(element);
            }
        }
    }
    
    onSwipeLeft(element) {
        const nav = element.dataset.swipeNav;
        const paths = {
            'music': '/events/',
            'events': '/merch/',
            'merch': '/music/'
        };
        
        if (paths[nav]) {
            this.navigateWithAnimation(paths[nav], 'left');
        }
    }
    
    onSwipeRight(element) {
        const nav = element.dataset.swipeNav;
        const paths = {
            'music': '/merch/',
            'events': '/music/',
            'merch': '/events/'
        };
        
        if (paths[nav]) {
            this.navigateWithAnimation(paths[nav], 'right');
        }
    }
    
    navigateWithAnimation(url, direction) {
        const body = document.body;
        const animClass = direction === 'left' ? 'slide-out-left' : 'slide-out-right';
        
        body.classList.add(animClass);
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }
    
    setupPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let pulling = false;
        
        const refreshIndicator = document.createElement('div');
        refreshIndicator.id = 'pull-refresh-indicator';
        refreshIndicator.innerHTML = `
            <div class="spinner"></div>
            <span>Pull to refresh</span>
        `;
        refreshIndicator.style.cssText = `
            position: fixed;
            top: -60px;
            left: 0;
            right: 0;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: rgba(0, 224, 255, 0.1);
            backdrop-filter: blur(10px);
            color: #00E0FF;
            font-weight: bold;
            transition: top 0.3s ease;
            z-index: 9998;
        `;
        document.body.appendChild(refreshIndicator);
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                pulling = true;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!pulling) return;
            
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            
            if (diff > 0 && diff < 100) {
                refreshIndicator.style.top = (diff - 60) + 'px';
            }
        });
        
        document.addEventListener('touchend', () => {
            if (!pulling) return;
            
            const diff = currentY - startY;
            
            if (diff > 80) {
                refreshIndicator.style.top = '0px';
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                refreshIndicator.style.top = '-60px';
            }
            
            pulling = false;
        });
    }
    
    setupDoubleTapToLike() {
        const likableElements = document.querySelectorAll('[data-double-tap-like]');
        
        likableElements.forEach(element => {
            let lastTap = 0;
            
            element.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 500 && tapLength > 0) {
                    this.onDoubleTap(element);
                    e.preventDefault();
                }
                
                lastTap = currentTime;
            });
        });
    }
    
    onDoubleTap(element) {
        const itemId = element.dataset.itemId;
        const itemType = element.dataset.itemType;
        
        // Trigger favorite
        if (typeof favoritesManager !== 'undefined') {
            favoritesManager.toggleFavorite(itemType, parseInt(itemId));
        }
        
        // Show heart animation
        this.showHeartAnimation(element);
    }
    
    showHeartAnimation(element) {
        const heart = document.createElement('div');
        heart.className = 'double-tap-heart';
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 80px;
            pointer-events: none;
            z-index: 100;
            animation: heartBurst 0.8s ease-out;
        `;
        
        element.style.position = 'relative';
        element.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 800);
    }
    
    setupLongPressActions() {
        const longPressElements = document.querySelectorAll('[data-long-press]');
        
        longPressElements.forEach(element => {
            let pressTimer;
            
            element.addEventListener('touchstart', (e) => {
                pressTimer = setTimeout(() => {
                    this.onLongPress(element, e);
                }, 500);
            });
            
            element.addEventListener('touchend', () => {
                clearTimeout(pressTimer);
            });
            
            element.addEventListener('touchmove', () => {
                clearTimeout(pressTimer);
            });
        });
    }
    
    onLongPress(element, event) {
        event.preventDefault();
        
        const action = element.dataset.longPress;
        
        switch (action) {
            case 'share':
                this.showShareMenu(element);
                break;
            case 'options':
                this.showOptionsMenu(element);
                break;
        }
        
        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    showShareMenu(element) {
        const menu = document.createElement('div');
        menu.className = 'mobile-action-menu';
        menu.innerHTML = `
            <div class="action-menu-backdrop"></div>
            <div class="action-menu-content glass-card">
                <h4 class="font-bold mb-4">Share this</h4>
                <div class="grid grid-cols-4 gap-4">
                    <button class="action-btn" data-share="whatsapp">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <span class="text-xs">WhatsApp</span>
                    </button>
                    <button class="action-btn" data-share="twitter">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        <span class="text-xs">Twitter</span>
                    </button>
                    <button class="action-btn" data-share="copy">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                        </svg>
                        <span class="text-xs">Copy Link</span>
                    </button>
                    <button class="action-btn" data-action="close">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-xs">Close</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Close on backdrop click
        menu.querySelector('.action-menu-backdrop').addEventListener('click', () => {
            menu.remove();
        });
        
        // Handle action buttons
        menu.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const share = btn.dataset.share;
                const action = btn.dataset.action;
                
                if (action === 'close') {
                    menu.remove();
                } else if (share) {
                    this.handleShare(share, element);
                    menu.remove();
                }
            });
        });
    }
    
    handleShare(platform, element) {
        const url = window.location.href;
        const text = element.dataset.shareText || 'Check this out on WhizzyVerse!';
        
        const shareUrls = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            copy: url
        };
        
        if (platform === 'copy') {
            navigator.clipboard.writeText(url).then(() => {
                this.showToast('Link copied to clipboard!');
            });
        } else {
            window.open(shareUrls[platform], '_blank');
        }
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'mobile-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 224, 255, 0.9);
            color: #0C0C0C;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 10000;
            animation: fadeInUp 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    showOptionsMenu(element) {
        console.log('Options menu for:', element);
    }
}

// Add necessary CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes heartBurst {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
        }
    }
    
    .slide-out-left {
        animation: slideOutLeft 0.3s ease forwards;
    }
    
    .slide-out-right {
        animation: slideOutRight 0.3s ease forwards;
    }
    
    @keyframes slideOutLeft {
        to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
    
    @keyframes slideOutRight {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .mobile-action-menu {
        position: fixed;
        inset: 0;
        z-index: 9999;
    }
    
    .action-menu-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
    }
    
    .action-menu-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 24px;
        border-radius: 20px 20px 0 0;
        animation: slideInUp 0.3s ease;
    }
    
    .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 12px;
        background: rgba(0, 224, 255, 0.1);
        border: 1px solid rgba(0, 224, 255, 0.3);
        border-radius: 12px;
        color: #00E0FF;
        transition: all 0.3s;
    }
    
    .action-btn:active {
        transform: scale(0.95);
        background: rgba(0, 224, 255, 0.2);
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize mobile gestures
let mobileGestures;

document.addEventListener('DOMContentLoaded', () => {
    mobileGestures = new MobileGestures();
});
