import { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { RewardProgress } from './components/RewardProgress';
import { RewardMilestones } from './components/RewardMilestones';
import { SmartBasketStep } from './components/SmartBasketStep';
import { PaymentStep } from './components/PaymentStep';
import { OrderConfirmation } from './components/OrderConfirmation';
import { DemoControls } from './components/DemoControls';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { PRODUCTS, CATEGORIES, DEMO_ORDER_HISTORY } from './data/demoData';
import type { Product, CartItem, SmartBasketConfig } from './types';
import { SmartBasketEngine } from './services/smartBasketEngine';
import { RewardEngine } from './services/rewardEngine';

const PROMO_TILES = [
  { label: 'Dairy & Eggs', sub: 'Fresh daily picks',  emoji: '🥛', cat: 'dairy-eggs', bg: '#EFF6FF', border: '#BFDBFE' },
  { label: 'Quick Snacks', sub: 'Party must-haves',   emoji: '🍿', cat: 'snacks',     bg: '#FFF7ED', border: '#FED7AA' },
  { label: 'Cold Drinks',  sub: 'Stay refreshed',     emoji: '🥤', cat: 'drinks',     bg: '#FEF2F2', border: '#FECACA' },
  { label: 'Fresh Veggies',sub: 'Farm to doorstep',   emoji: '🥦', cat: 'fresh',      bg: '#F0FDF4', border: '#BBF7D0' },
];

export function App() {
  const [view, setView] = useState<'home' | 'smart-basket' | 'payment' | 'confirmation'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // App state
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [simulatedDay, setSimulatedDay] = useState<'Saturday' | 'Wednesday'>('Saturday');
  
  // User state
  const initialQualifying = RewardEngine.getQualifyingOrders(DEMO_ORDER_HISTORY);
  const [qualifyingOrders, setQualifyingOrders] = useState(initialQualifying);
  const [lastOrderValue, setLastOrderValue] = useState(0);

  const config: SmartBasketConfig = useMemo(() => ({
    simulatedDate: simulatedDay === 'Saturday' ? '2026-08-08' : '2026-08-05',
    simulatedDayOfWeek: simulatedDay,
    confidenceThreshold: 45,
  }), [simulatedDay]);

  const { products: recommended, detailsMap } = useMemo(
    () => SmartBasketEngine.getRecommendations(cart, dismissedIds, config),
    [cart, dismissedIds, config]
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id);
      if (idx > -1) { const u = [...prev]; u[idx] = { ...u[idx], quantity: u[idx].quantity + 1 }; return u; }
      return [...prev, { product, quantity: 1 }];
    });
    if (!addedIds.includes(product.id)) setAddedIds(prev => [...prev, product.id]);
  };

  const removeFromCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing?.quantity === 1) return prev.filter(i => i.product.id !== product.id);
      return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const updateQuantity = (product: Product, qty: number) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i.product.id !== product.id));
    else setCart(prev => prev.map(i => i.product.id === product.id ? { ...i, quantity: qty } : i));
  };

  const addAllToCart = (products: Product[]) => {
    setCart(prev => {
      let u = [...prev];
      products.forEach(p => {
        const idx = u.findIndex(i => i.product.id === p.id);
        if (idx > -1) u[idx] = { ...u[idx], quantity: u[idx].quantity + 1 };
        else u.push({ product: p, quantity: 1 });
      });
      return u;
    });
    setAddedIds(prev => Array.from(new Set([...prev, ...products.map(p => p.id)])));
  };

  // Flow handlers
  const handleProceedToCheckout = () => {
    if (recommended.length > 0) {
      setView('smart-basket');
    } else {
      setView('payment');
    }
  };

  const handlePlaceOrder = () => {
    const itemTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const deliveryFee = itemTotal > 0 && itemTotal < 99 ? 15 : 0;
    const handlingFee = cart.length > 0 ? 5 : 0;
    const grandTotal = itemTotal + deliveryFee + handlingFee;
    
    setLastOrderValue(grandTotal);
    setView('confirmation');
    
    if (grandTotal >= 500) {
      setQualifyingOrders(prev => prev + 1);
    }
  };

  const handleBackToHome = () => {
    setCart([]);
    setAddedIds([]);
    setDismissedIds([]);
    setView('home');
  };

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  }), [selectedCategory, searchQuery]);

  const catLabel = CATEGORIES.find(c => c.id === selectedCategory)?.name ?? 'All';

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Navbar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {view === 'home' && (
        <div className="main">
          {/* Hero */}
          <div className="hero">
            <div className="hero-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Superfast Delivery
            </div>
            <h1>Groceries in <span>10 Minutes</span> ⚡</h1>
            <p>Fresh groceries, daily essentials & much more — delivered to your door in minutes.</p>
            <div className="hero-emoji">🛒</div>
          </div>

          {/* Reward Progress */}
          <RewardProgress 
            qualifyingOrders={qualifyingOrders} 
            onViewRewards={() => setIsRewardModalOpen(true)} 
          />

          {/* Promo tiles */}
          <div className="promo-tiles">
            {PROMO_TILES.map(t => (
              <button
                key={t.cat}
                className="promo-tile"
                style={{ background: t.bg, borderColor: t.border }}
                onClick={() => setSelectedCategory(t.cat)}
              >
                <div className="promo-tile-emoji">{t.emoji}</div>
                <div className="promo-tile-name">{t.label}</div>
                <div className="promo-tile-sub">{t.sub}</div>
              </button>
            ))}
          </div>

          {/* Product section */}
          <div className="section-header">
            <h2 className="section-title">
              {selectedCategory === 'all' ? 'Best Sellers' : catLabel}
            </h2>
            {selectedCategory !== 'all' && (
              <button className="section-see-all" onClick={() => setSelectedCategory('all')}>
                See all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 20px', color: '#737373' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#404040' }}>No products found</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Try a different category or search term</p>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map(product => {
                const cartItem = cart.find(i => i.product.id === product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantityInCart={cartItem?.quantity ?? 0}
                    onAddToCart={addToCart}
                    onRemoveFromCart={removeFromCart}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {view === 'smart-basket' && (
        <SmartBasketStep 
          recommendations={recommended}
          detailsMap={detailsMap}
          addedProductIds={addedIds}
          onAddProduct={addToCart}
          onAddSelected={(products) => {
            addAllToCart(products);
            setView('payment');
          }}
          onSkip={() => setView('payment')}
        />
      )}

      {view === 'payment' && (
        <PaymentStep 
          cart={cart}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {view === 'confirmation' && (
        <OrderConfirmation 
          qualifyingOrdersBefore={qualifyingOrders - (lastOrderValue >= 500 ? 1 : 0)}
          orderValue={lastOrderValue}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* Footer */}
      {view === 'home' && (
        <footer className="footer" style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#737373', fontWeight: 600 }}>© 2026 Blinkit Prototype</p>
        </footer>
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <RewardMilestones 
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        qualifyingOrders={qualifyingOrders}
      />

      {/* Demo Controls */}
      <DemoControls
        simulatedDay={simulatedDay}
        onToggleDay={() => setSimulatedDay(d => d === 'Saturday' ? 'Wednesday' : 'Saturday')}
        onOpenInspector={() => setIsInspectorOpen(true)}
        onReset={() => {
          setCart([]);
          setAddedIds([]);
          setDismissedIds([]);
          setQualifyingOrders(initialQualifying);
          setView('home');
        }}
      />
      <OrderHistoryModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        scoreDetailsMap={detailsMap}
        simulatedDay={simulatedDay}
      />
    </div>
  );
}

export default App;
