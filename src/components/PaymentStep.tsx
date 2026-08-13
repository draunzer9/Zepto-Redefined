import type { CartItem } from '../types';

interface Props {
  cart: CartItem[];
  onPlaceOrder: () => void;
}

export function PaymentStep({ cart, onPlaceOrder }: Props) {
  const itemTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const deliveryFee = itemTotal > 0 && itemTotal < 99 ? 15 : 0;
  const handlingFee = cart.length > 0 ? 5 : 0;
  const grandTotal = itemTotal + deliveryFee + handlingFee;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px', paddingBottom: '100px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#171717', marginBottom: '24px' }}>Order Summary</h2>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8E8', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #F5F5F5' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#525252', textTransform: 'uppercase' }}>Items ({cart.length})</h3>
        </div>
        <div style={{ padding: '0 16px' }}>
          {cart.map(item => (
            <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F5F5F5' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E8E8E8' }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#171717' }}>{item.product.name}</div>
                  <div style={{ fontSize: '12px', color: '#737373' }}>Qty: {item.quantity}</div>
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#171717' }}>₹{item.product.price * item.quantity}</div>
            </div>
          ))}
        </div>
        
        <div style={{ padding: '16px', background: '#FAFAFA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#525252' }}>
            <span>Item Total</span>
            <span>₹{itemTotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#525252' }}>
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? <span style={{ color: '#0C831F', fontWeight: 700 }}>FREE</span> : `₹\${deliveryFee}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: '#525252' }}>
            <span>Handling Charge</span>
            <span>₹{handlingFee}</span>
          </div>
          <div style={{ height: '1px', background: '#E8E8E8', marginBottom: '12px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#171717' }}>
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: '16px 20px', borderTop: '1px solid #E8E8E8', boxShadow: '0 -4px 12px rgba(0,0,0,0.05)', zIndex: 100 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button 
            onClick={onPlaceOrder}
            style={{ 
              width: '100%', padding: '16px', borderRadius: '12px', 
              background: '#0C831F', color: 'white', 
              fontSize: '16px', fontWeight: 800,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              border: 'none', cursor: 'pointer'
            }}
          >
            <span>Pay ₹{grandTotal}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Place Order
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
