import React, { useState } from 'react';
import type { Category, CartItem } from '../types';
import { DEMO_USER } from '../data/demoData';

interface NavbarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  smartBasketCount: number;
  onOpenSmartBasket: () => void;
}

const ZeptoLogo = () => (
  <svg width="76" height="25" viewBox="0 0 180 59" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#fff" d="M93.946 8.93c10.055 0 17.667 8.168 17.667 18.51 0 10.343-7.612 18.512-17.667 18.512a17.39 17.39 0 0 1-11.587-4.327v13.69a3.882 3.882 0 0 1-3.84 3.333 3.878 3.878 0 0 1-3.84-3.334V12.84a3.882 3.882 0 0 1 3.84-3.333 3.877 3.877 0 0 1 3.84 3.333v.485A17.07 17.07 0 0 1 93.946 8.93ZM123.785 0a3.89 3.89 0 0 1 3.728 2.782c.157.533.197 1.093.119 1.643V9.66h8.18a3.545 3.545 0 0 1 2.536 1.03 3.521 3.521 0 0 1 1.039 2.528 3.572 3.572 0 0 1-1.054 2.513 3.59 3.59 0 0 1-2.521 1.045h-8.18v12.604c0 6.147 3.429 9.288 8.18 9.288.955 0 1.872.38 2.548 1.054a3.594 3.594 0 0 1-2.548 6.14c-9.025 0-15.874-6.35-15.874-16.482V16.777h-2.516a3.59 3.59 0 0 1-2.522-1.045 3.575 3.575 0 0 1-.789-3.881 3.54 3.54 0 0 1 3.311-2.19h2.516V4.425a3.868 3.868 0 0 1 .912-3.088A3.874 3.874 0 0 1 123.785 0ZM45.453 10.653a18.513 18.513 0 0 1 19.68 2.587 4.043 4.043 0 0 1 1.39 2.902 4.002 4.002 0 0 1-1.119 2.796l-10.69 12.758a3.226 3.226 0 0 1-2.644 1.257 3.419 3.419 0 0 1-3.345-2.108 3.444 3.444 0 0 1-.263-1.373 3.144 3.144 0 0 1 .829-2.303l8.414-9.886a8.504 8.504 0 0 0-4.583-1.258c-5.972 0-10.7 5.021-10.7 11.357 0 6.336 4.66 11.356 10.7 11.356a9.956 9.956 0 0 0 7.361-3.143c1.11-.9 1.882-1.732 3.338-1.732a3.593 3.593 0 0 1 3.489 2.243c.185.458.276.948.265 1.442a4.06 4.06 0 0 1-1.119 2.506 17.275 17.275 0 0 1-6.028 4.377 17.233 17.233 0 0 1-7.306 1.426A18.1 18.1 0 0 1 40.01 40.53a18.228 18.228 0 0 1-5.307-13.148 18.637 18.637 0 0 1 2.956-9.927 18.569 18.569 0 0 1 7.794-6.802Zm109.015-.319a18.466 18.466 0 1 1 7.066 35.525 18.147 18.147 0 0 1-18.465-18.465 18.467 18.467 0 0 1 11.399-17.06Zm-126.98-.796a3.512 3.512 0 0 1 2.529 1.033 3.536 3.536 0 0 1 1.03 2.536 3.721 3.721 0 0 1-1.114 2.52L11.145 38.114h16.343a3.513 3.513 0 0 1 2.529 1.034 3.538 3.538 0 0 1 1.03 2.537A3.595 3.595 0 0 1 30 44.203a3.574 3.574 0 0 1-2.512 1.05H3.56a3.593 3.593 0 0 1-2.53-1.08A3.614 3.614 0 0 1 0 41.616a3.82 3.82 0 0 1 1.048-2.53l18.759-22.41H4.374a3.574 3.574 0 0 1-2.51-1.05 3.595 3.595 0 0 1-1.05-2.519A3.54 3.54 0 0 1 3.006 9.8c.434-.178.9-.266 1.368-.26h23.114Zm65.624 6.513c-6.002 0-10.54 4.686-10.753 10.895v.494c0 6.5 4.751 11.391 10.753 11.391s10.753-4.89 10.753-11.39c0-6.5-4.75-11.39-10.753-11.39Zm68.422-.019c-6.126 0-10.732 5.091-10.732 11.363 0 6.27 4.597 11.36 10.732 11.36 6.136 0 10.733-5.157 10.734-11.36 0-6.272-4.608-11.363-10.734-11.363Z" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  categories, selectedCategory, onSelectCategory,
  searchQuery, onSearchChange, cart, onOpenCart,
  smartBasketCount, onOpenSmartBasket,
}) => {
  const [focused, setFocused] = useState(false);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalValue = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <header className="header">
      <div className="header-main">
        {/* Logo */}
        <div className="header-logo"><ZeptoLogo /></div>

        {/* Location */}
        <div className="header-location">
          <div className="header-location-label">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFC107" strokeWidth="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            Deliver to
          </div>
          <div className="header-location-city">
            {DEMO_USER.locationLabel}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 1, maxWidth: 130, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {DEMO_USER.locationSub}
          </div>
        </div>

        {/* Search */}
        <div className="header-search">
          <svg className="header-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            type="text"
            placeholder='Search for "milk", "eggs", "rice"...'
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ boxShadow: focused ? '0 0 0 3px rgba(255,193,7,0.35)' : undefined }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="header-actions">
          {smartBasketCount > 0 && (
            <button className="ai-basket-pill" onClick={onOpenSmartBasket}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFC107"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Smart Basket
              <span className="ai-basket-count">{smartBasketCount}</span>
            </button>
          )}
          <button className="cart-btn" onClick={onOpenCart}>
            <div className="cart-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B0066" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </div>
            <div className="cart-btn-text">
              <span className="cart-btn-label">My Cart</span>
              <span className="cart-btn-value">{totalItems === 0 ? '0 items' : `₹${totalValue}`}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Delivery strip */}
      <div className="delivery-strip">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFC107"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        <span><b>10-Minute Delivery</b> · Fresh groceries at your doorstep</span>
      </div>

      {/* Category strip */}
      <div className="cat-strip">
        <div className="cat-strip-inner">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`cat-pill${selectedCategory === cat.id ? ' active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
