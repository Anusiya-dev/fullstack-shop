import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { fetchProducts } from '../services/api';
import { addProductToCart } from '../utils/cart';

function Shop() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const [wishlist, setWishlist] = useState(new Set());
  const [addedId, setAddedId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts({
        category: activeFilter,
        ordering: sortOrder,
      });
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Could not load products. Is the Django server running?');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, sortOrder]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function addToCart(product) {
    addProductToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
    const toastEl = document.getElementById('liveToast');
    if (toastEl && window.bootstrap) {
      window.bootstrap.Toast.getOrCreateInstance(toastEl).show();
    }
  }

  function toggleWishlist(id) {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <>
      <Navbar />

      <div className="page-header">
        <span>All Products</span>
        <h1>Shop the Collection</h1>
      </div>

      <div className="filter-bar">
        {['all', 'summer', 'festive', 'minimal'].map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat === 'all' ? 'All' :
             cat === 'summer' ? 'Summer Edit' :
             cat === 'festive' ? 'Festive Collection' : 'Minimalist'}
          </button>
        ))}

        <select
          className="sort-select"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
        >
          <option value="default">Sort by</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      <div className="shop-section">
        {loading && <p className="text-center py-5">Loading collection…</p>}
        {error && (
          <p className="text-center py-5 text-danger" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && (
          <div className="row g-4" id="productsGrid">
            {products.map(product => (
              <div key={product.id} className="col-sm-6 col-md-4 product-card" data-category={product.category}>
                <div className={`product-img ${product.bg_class}`}>
                  {product.badge && (
                    <span className={`badge ${product.badge === 'Popular' ? 'bg-danger' : ''}`}>
                      {product.badge}
                    </span>
                  )}
                  <img src={product.image} alt={product.name} className="product-photo" />
                  <button
                    className={`wishlist-btn ${wishlist.has(product.id) ? 'wished' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                    title="Add to Wishlist"
                  >
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
                <div className="product-body">
                  <p className="product-category">{product.category_label}</p>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">₹{product.price.toLocaleString()}</p>
                  <button
                    className={`add-btn ${addedId === product.id ? 'added' : ''}`}
                    onClick={() => addToCart(product)}
                    disabled={product.stock < 1}
                  >
                    {product.stock < 1 ? 'Out of Stock' :
                     addedId === product.id ? 'Added ✓' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" className="toast align-items-center text-bg-dark border-0" role="alert">
          <div className="d-flex">
            <div className="toast-body">Item added to cart ✓</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;
