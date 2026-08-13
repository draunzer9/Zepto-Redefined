import React from 'react';
import type { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (product: Product, quantity: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen, onClose, cart, onUpdateQuantity, onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const itemTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const mrpTotal = cart.reduce((s, i) => s + (i.product.originalPrice ?? i.product.price) * i.quantity, 0);
  const savings = mrpTotal - itemTotal;
  const deliveryFee = itemTotal > 0 && itemTotal < 99 ? 15 : 0;
  const handlingFee = cart.length > 0 ? 5 : 0;
  const grandTotal = itemTotal + deliveryFee + handlingFee;
  
  const amountToQualify = 500 - itemTotal;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <div className="cart-header-left">
            <h2>My Cart</h2>
            <div className="cart-delivery-tag">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#0C831F"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Delivery in 10 mins
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p style={{ fontWeight: 700, fontSize: 16, color: '#262626' }}>Your cart is empty</p>
              <p style={{ fontSize: 13, color: '#737373', marginTop: 4 }}>Add items to get started</p>
            </div>
          ) : (
            <>
              {amountToQualify > 0 ? (
                <div style={{ background: '#FFF4D1', border: '1px solid #F8CB46', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', color: '#171717', fontWeight: 600 }}>
                  <span style={{ fontSize: '16px', marginRight: '6px' }}>🎁</span>
                  Add ₹{amountToQualify} more to make this a qualifying ₹500+ order and move closer to your next reward.
                </div>
              ) : (
                <div style={{ background: '#E8F5E9', border: '1px solid #0C831F', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', color: '#0A6918', fontWeight: 700 }}>
                  🎉 This order qualifies toward your next reward!
                </div>
              )}

              <div className="cart-items-card">
                <div className="cart-items-header">
                  <span className="cart-items-label">{cart.length} Item{cart.length !== 1 ? 's' : ''}</span>
                  {savings > 0 && <span className="savings-badge">Saving ₹{savings}</span>}
                </div>
                {cart.map((item, idx) => (
                  <div key={item.product.id} className="cart-item" style={idx === cart.length - 1 ? { borderBottom: 'none' } : {}}>
                    <div className="cart-item-img">
                      <img src={item.product.image} alt={item.product.name} />
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.product.name}</div>
                      <div className="cart-item-weight">{item.product.weight}</div>
                      <div className="cart-item-price">
                        <span className="cart-item-price-main">₹{item.product.price * item.quantity}</span>
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <span className="cart-item-price-orig">₹{item.product.originalPrice * item.quantity}</span>
                        )}
                      </div>
                    </div>
                    <div className="qty-stepper">
                      <button className="qty-btn" onClick={() => onUpdateQuantity(item.product, item.quantity - 1)}>
                        {item.quantity === 1
                          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                          : '−'}
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => onUpdateQuantity(item.product, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bill-card">
                <div className="bill-header"><span className="bill-header-label">Bill Details</span></div>
                <div className="bill-body">
                  <div className="bill-row">
                    <span className="bill-row-label">MRP Total</span>
                    <span className="bill-row-val">₹{mrpTotal}</span>
                  </div>
                  {savings > 0 && (
                    <div className="bill-row">
                      <span className="bill-row-label" style={{ color: '#0C831F' }}>Discount on MRP</span>
                      <span className="bill-row-val saving">−₹{savings}</span>
                    </div>
                  )}
                  <div className="bill-row">
                    <span className="bill-row-label">Delivery Fee</span>
                    <span className={`bill-row-val \${deliveryFee === 0 ? 'free' : ''}`}>
                      {deliveryFee === 0 ? 'FREE' : `₹\${deliveryFee}`}
                    </span>
                  </div>
                  <div className="bill-row">
                    <span className="bill-row-label">Handling Charge</span>
                    <span className="bill-row-val">₹{handlingFee}</span>
                  </div>
                  <div className="bill-divider" />
                  <div className="bill-total">
                    <span className="bill-total-label">Grand Total</span>
                    <span className="bill-total-val">₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              <div className="safety-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0C831F" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                <span>100% safe &amp; fresh products, guaranteed.</span>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="checkout-footer">
            <button className="checkout-btn" onClick={() => { onClose(); onProceedToCheckout(); }}>
              <div>
                <div className="checkout-label-sub">Total</div>
                <div className="checkout-label-val">₹{grandTotal}</div>
              </div>
              <div className="checkout-label-action">
                Proceed to Checkout
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
