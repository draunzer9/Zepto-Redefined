import React from 'react';
import type { Product, RecommendationScoreDetails } from '../types';

interface Props {
  recommendations: Product[];
  detailsMap: Record<string, RecommendationScoreDetails>;
  onAddProduct: (product: Product) => void;
  onAddSelected: (products: Product[]) => void;
  onSkip: () => void;
  addedProductIds: string[];
}

export function SmartBasketStep({ recommendations, detailsMap, onAddSelected, onSkip, addedProductIds }: Props) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddSelected = () => {
    const toAdd = recommendations.filter(p => selectedIds.has(p.id));
    onAddSelected(toAdd);
  };

  const totalSelectedValue = recommendations
    .filter(p => selectedIds.has(p.id))
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px', paddingBottom: '100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#171717', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          🧠 Smart Basket
        </h2>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#525252', marginTop: '4px' }}>Your AI-powered shopping assistant</div>
        <p style={{ fontSize: '14px', color: '#737373', marginTop: '12px', background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #E8E8E8' }}>
          We analyzed your recent orders to find products you may want to add before checkout.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {recommendations.map(product => {
          const isAdded = addedProductIds.includes(product.id);
          const isSelected = selectedIds.has(product.id);
          const details = detailsMap[product.id];
          
          return (
            <div key={product.id} style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '16px', 
              border: `2px solid \${isSelected ? '#0C831F' : '#E8E8E8'}`,
              display: 'flex',
              gap: '16px',
              transition: 'all 0.2s',
              cursor: isAdded ? 'default' : 'pointer'
            }} onClick={() => !isAdded && toggleSelect(product.id)}>
              <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: '#F5F5F5', flexShrink: 0, border: '1px solid #E8E8E8' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#171717', lineHeight: 1.3, marginBottom: '4px' }}>{product.name}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#171717' }}>₹{product.price}</div>
                </div>
                
                <div style={{ fontSize: '12px', color: '#A3A3A3', marginBottom: '8px' }}>{product.weight}</div>
                
                <div style={{ background: '#FFF4D1', color: '#E5B426', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '12px' }}>
                  {details.totalScore >= 70 ? 'High confidence' : 'Based on your last 8 orders'}
                </div>
                
                <div style={{ fontSize: '12px', color: '#525252', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  {details.reason || 'Based on your previous orders.'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isAdded ? (
                  <div style={{ background: '#E8F5E9', color: '#0C831F', fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '8px' }}>Added ✓</div>
                ) : (
                  <div style={{ 
                    width: '24px', height: '24px', 
                    borderRadius: '50%', 
                    border: `2px solid \${isSelected ? '#0C831F' : '#D4D4D4'}`,
                    background: isSelected ? '#0C831F' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: '16px 20px', borderTop: '1px solid #E8E8E8', boxShadow: '0 -4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 100 }}>
        {selectedIds.size > 0 && (
          <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#171717' }}>
            Smart Basket total: ₹{totalSelectedValue}
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <button onClick={onSkip} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#F5F5F5', color: '#525252', fontSize: '14px', fontWeight: 700 }}>
            Skip Smart Basket
          </button>
          <button 
            onClick={handleAddSelected}
            style={{ 
              flex: 1, padding: '14px', borderRadius: '12px', 
              background: selectedIds.size > 0 ? '#0C831F' : '#E8E8E8', 
              color: selectedIds.size > 0 ? 'white' : '#A3A3A3', 
              fontSize: '14px', fontWeight: 700 
            }}
            disabled={selectedIds.size === 0}
          >
            Add selected items
          </button>
        </div>
      </div>
    </div>
  );
}
