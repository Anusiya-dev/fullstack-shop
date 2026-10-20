const CART_KEY = 'auraCart';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
}

export function addProductToCart(product) {
  const cart = getCart();
  const id = product.id;
  const existing = cart.find(item => item.product_id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      product_id: id,
      name: product.name,
      price: product.price,
      img: product.image,
      qty: 1,
    });
  }
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cartUpdated'));
}
