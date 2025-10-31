class ShoppingCart {
    constructor() {
        this.storageKey = 'whizzyverse_cart';
        this.cart = this.loadCart();
    }

    loadCart() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : { items: [] };
        } catch (error) {
            console.error('Error loading cart:', error);
            return { items: [] };
        }
    }

    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
            this.dispatchChangeEvent();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    addItem(item, quantity = 1, size = 'M') {
        const existingItem = this.cart.items.find(
            i => i.id === item.id && i.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image_url: item.image_url,
                category: item.category,
                size: size,
                quantity: quantity
            });
        }

        this.saveCart();
        return true;
    }

    removeItem(itemId, size) {
        this.cart.items = this.cart.items.filter(
            item => !(item.id === itemId && item.size === size)
        );
        this.saveCart();
    }

    updateQuantity(itemId, size, quantity) {
        const item = this.cart.items.find(
            i => i.id === itemId && i.size === size
        );

        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId, size);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    getItems() {
        return this.cart.items;
    }

    getItemCount() {
        return this.cart.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotal() {
        return this.cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );
    }

    clear() {
        this.cart = { items: [] };
        this.saveCart();
    }

    dispatchChangeEvent() {
        window.dispatchEvent(new CustomEvent('cartChanged', {
            detail: {
                items: this.cart.items,
                count: this.getItemCount(),
                total: this.getTotal()
            }
        }));
    }
}

const shoppingCart = new ShoppingCart();

function cartWidget() {
    return {
        isOpen: false,
        items: [],
        itemCount: 0,
        total: 0,

        init() {
            this.updateCart();

            window.addEventListener('cartChanged', () => {
                this.updateCart();
            });
        },

        updateCart() {
            this.items = shoppingCart.getItems();
            this.itemCount = shoppingCart.getItemCount();
            this.total = shoppingCart.getTotal();
        },

        removeItem(itemId, size) {
            if (confirm('Remove this item from cart?')) {
                shoppingCart.removeItem(itemId, size);
            }
        },

        updateQuantity(itemId, size, quantity) {
            shoppingCart.updateQuantity(itemId, size, parseInt(quantity));
        },

        checkout() {
            if (this.items.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            alert(`Checkout coming soon! Total: $${this.total.toFixed(2)}\n\nThis is a demo platform. Payment integration will be added in production.`);
        },

        clearCart() {
            if (confirm('Clear entire cart?')) {
                shoppingCart.clear();
            }
        }
    }
}
