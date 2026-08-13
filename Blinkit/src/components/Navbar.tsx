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
  
  
}

const BlinkitLogo = () => (
  <div style={{ fontSize: '28px', fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>blinkit</div>
);

export const Navbar: React.FC<NavbarProps> = ({
  categories, selectedCategory, onSelectCategory,
  searchQuery, onSearchChange, cart, onOpenCart,
  
}) => {
  const [focused, setFocused] = useState(false);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalValue = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <header className="header">
      <div className="header-main">
        {/* Logo */}
        <div className="header-logo"><BlinkitLogo /></div>

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
