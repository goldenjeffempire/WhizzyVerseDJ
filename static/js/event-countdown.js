function eventCountdown(eventDate) {
    return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
        interval: null,

        init() {
            this.updateCountdown();
            this.interval = setInterval(() => {
                this.updateCountdown();
            }, 1000);
        },

        updateCountdown() {
            const now = new Date().getTime();
            const eventTime = new Date(eventDate).getTime();
            const distance = eventTime - now;

            if (distance < 0) {
                this.isExpired = true;
                if (this.interval) {
                    clearInterval(this.interval);
                }
                return;
            }

            this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
            this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        },

        destroy() {
            if (this.interval) {
                clearInterval(this.interval);
            }
        }
    }
}
