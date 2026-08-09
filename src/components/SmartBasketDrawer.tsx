import React from 'react';
import type { Product } from '../types';

interface SmartBasketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: Product[];
  onAddProduct: (p: Product) => void;
  onAddAll: (products: Product[]) => void;
  onDismissProduct: (id: string) => void;
  addedProductIds: string[];
  onCheckoutSuccess: () => void;
}

export const SmartBasketDrawer: React.FC<SmartBasketDrawerProps> = ({
  isOpen, onClose, recommendations, onAddProduct, onAddAll, onDismissProduct, addedProductIds, onCheckoutSuccess
}) => {
  if (!isOpen) return null;
  const unadded = recommendations.filter(p => !addedProductIds.includes(p.id));

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sb-drawer" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sb-drawer-header">
          <div className="sb-drawer-header-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="sb-drawer-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFC107"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <div>
                <div className="sb-drawer-title">Your Smart Grocery Basket</div>
                <div className="sb-drawer-sub">Don't forget your essentials</div>
              </div>
            </div>
            <button className="drawer-close-btn" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="sb-drawer-badges">
            <span className="sb-count-badge">{recommendations.length} items predicted</span>
            <span className="sb-ai-tag">AI-powered · Based on your orders</span>
          </div>
        </div>

        {/* Items */}
        <div className="sb-body">
          {recommendations.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#262626' }}>Your basket is complete!</p>
              <p style={{ fontSize: 13, color: '#737373', marginTop: 4 }}>No predicted essentials for today.</p>
            </div>
          ) : (
            recommendations.map(product => {
              const added = addedProductIds.includes(product.id);
              return (
                <div key={product.id} className={`sb-item${added ? ' added' : ''}`}>
                  <div className="sb-item-img">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="sb-item-info">
                    <div className="sb-item-name">{product.name}</div>
                    <div className="sb-item-weight">{product.weight}</div>
                    <div className="sb-item-price">
                      <span className="sb-item-price-main">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="sb-item-price-orig">₹{product.originalPrice}</span>
                      )}
                      {product.discountPercentage && product.discountPercentage > 0 && (
                        <span className="sb-item-off">{product.discountPercentage}% off</span>
                      )}
                    </div>
                  </div>
                  <div className="sb-item-actions">
                    {added ? (
                      <div className="btn-added">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0C831F" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                        Added
                      </div>
                    ) : (
                      <button className="btn-add" onClick={() => onAddProduct(product)}>+ ADD</button>
                    )}
                    {!added && (
                      <button className="btn-not-needed" onClick={() => onDismissProduct(product.id)}>
                        Not needed
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {recommendations.length > 0 && (
          <div className="sb-footer">
            {unadded.length > 0 && (
              <button className="btn-add-all" onClick={() => onAddAll(unadded)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFC107"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Add All {unadded.length} Items to Cart
              </button>
            )}
            <button className="checkout-btn" onClick={onCheckoutSuccess} style={{ display: 'flex', justifyContent: 'center' }}>
               <div className="checkout-label-action">
                 Proceed to Pay
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
               </div>
            </button>
            <button className="btn-continue" onClick={onClose} style={{ background: 'transparent', color: '#737373', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer', padding: '8px' }}>Continue Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
};
