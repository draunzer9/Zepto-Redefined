import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (p: Product) => void;
  onRemoveFromCart: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product, quantityInCart, onAddToCart, onRemoveFromCart,
}) => {
  const isVeg = product.isVegetarian !== false;

  return (
    <div className="product-card">
      {/* Image */}
      <div className="product-card-img-wrap">
        {product.discountPercentage && product.discountPercentage > 0 && (
          <div className="product-discount-badge">{product.discountPercentage}% OFF</div>
        )}
        <div
          className="product-veg-dot"
          style={{ borderColor: isVeg ? '#0C831F' : '#FF3B30' }}
        >
          <div className="product-veg-inner" style={{ background: isVeg ? '#0C831F' : '#FF3B30' }} />
        </div>
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      {/* Body */}
      <div className="product-card-body">
        {/* Delivery time */}
        <div className="product-delivery">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#0C831F"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span>{product.deliveryTimeMins} MINS</span>
        </div>

        <div className="product-name">{product.name}</div>
        <div className="product-weight">{product.weight}</div>

        {/* Footer: price + add */}
        <div className="product-footer">
          <div className="product-price">
            <span className="product-price-main">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="product-price-orig">₹{product.originalPrice}</span>
            )}
          </div>

          {quantityInCart === 0 ? (
            <button className="btn-add" onClick={() => onAddToCart(product)}>ADD</button>
          ) : (
            <div className="qty-stepper">
              <button className="qty-btn" onClick={() => onRemoveFromCart(product)}>−</button>
              <span className="qty-val">{quantityInCart}</span>
              <button className="qty-btn" onClick={() => onAddToCart(product)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
