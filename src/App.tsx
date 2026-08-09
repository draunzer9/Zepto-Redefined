import { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { SmartBasketDrawer } from './components/SmartBasketDrawer';
import { CartDrawer } from './components/CartDrawer';
import { DemoControls } from './components/DemoControls';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { PRODUCTS, CATEGORIES } from './data/demoData';
import type { Product, CartItem, SmartBasketConfig } from './types';
import { SmartBasketEngine } from './services/smartBasketEngine';

const PROMO_TILES = [
  { label: 'Dairy & Eggs', sub: 'Fresh daily picks',  emoji: '🥛', cat: 'dairy-eggs', bg: '#EFF6FF', border: '#BFDBFE' },
  { label: 'Quick Snacks', sub: 'Party must-haves',   emoji: '🍿', cat: 'snacks',     bg: '#FFF7ED', border: '#FED7AA' },
  { label: 'Cold Drinks',  sub: 'Stay refreshed',     emoji: '🥤', cat: 'drinks',     bg: '#FEF2F2', border: '#FECACA' },
  { label: 'Fresh Veggies',sub: 'Farm to doorstep',   emoji: '🥦', cat: 'fresh',      bg: '#F0FDF4', border: '#BBF7D0' },
];

export function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [simulatedDay, setSimulatedDay] = useState<'Saturday' | 'Wednesday'>('Saturday');
  const [isSmartBasketOpen, setIsSmartBasketOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  const addAll = (products: Product[]) => {
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

  const unaddedCount = recommended.filter(p => !addedIds.includes(p.id)).length;

  const openCart = () => {
    setIsCartOpen(true);
    if (recommended.length > 0) setIsSmartBasketOpen(true);
  };

  const handleDemoRun = () => {
    const paneer = PRODUCTS.find(p => p.id === 'prod_paneer_200g');
    const rice = PRODUCTS.find(p => p.id === 'prod_basmati_rice');
    if (paneer) addToCart(paneer);
    if (rice) addToCart(rice);
    openCart();
  };

  const reset = () => { setCart([]); setDismissedIds([]); setAddedIds([]); setSuccessMsg(null); };

  const checkoutSuccess = () => {
    setIsCartOpen(false);
    setIsSmartBasketOpen(false);
    setCart([]);
    setAddedIds([]);
    setSuccessMsg('Order placed! Your groceries arrive in 10 minutes ⚡');
    setTimeout(() => setSuccessMsg(null), 5000);
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
        onOpenCart={openCart}
        smartBasketCount={recommended.length}
        onOpenSmartBasket={() => setIsSmartBasketOpen(true)}
      />

      {/* Toast */}
      {successMsg && (
        <div className="toast">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          {successMsg}
          <button onClick={() => setSuccessMsg(null)} style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      )}

      <div className="main">
        {/* ── Hero ─────────────────────────────────── */}
        <div className="hero">
          <div className="hero-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Superfast Delivery
          </div>
          <h1>Groceries in <span>10 Minutes</span> ⚡</h1>
          <p>Fresh groceries, daily essentials &amp; much more — delivered to your door in minutes. Our Smart Grocery Basket predicts what you'll need next.</p>
          <button className="hero-demo-btn" onClick={handleDemoRun}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#3B0066"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Run Demo Scenario
          </button>
          <div className="hero-emoji">🛒</div>
        </div>

        {/* ── Smart Basket callout ──────────────────── */}
        {recommended.length > 0 && (
          <button className="sb-callout" onClick={() => setIsSmartBasketOpen(true)}>
            <div className="sb-callout-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFC107"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div className="sb-callout-body">
              <div className="sb-callout-title">
                Your Smart Grocery Basket
                <span className="sb-callout-badge">{recommended.length} essentials</span>
              </div>
              <div className="sb-callout-sub">Don't forget your essentials — predicted for today</div>
            </div>
            <svg className="sb-callout-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}

        {/* ── Promo tiles ───────────────────────────── */}
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

        {/* ── Product section ───────────────────────── */}
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

        {/* ── Trust badges ─────────────────────────── */}
        <div className="trust-row">
          {[
            { emoji: '⚡', title: '10 Min Delivery', sub: 'Ultra-fast to your door' },
            { emoji: '✅', title: '100% Fresh',       sub: 'Quality guaranteed' },
            { emoji: '💰', title: 'Best Prices',      sub: 'Save more every day' },
          ].map(t => (
            <div key={t.title} className="trust-card">
              <div className="trust-emoji">{t.emoji}</div>
              <div className="trust-title">{t.title}</div>
              <div className="trust-sub">{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <svg width="56" height="18" viewBox="0 0 180 59" fill="none">
          <path fill="#9333ea" d="M93.946 8.93c10.055 0 17.667 8.168 17.667 18.51 0 10.343-7.612 18.512-17.667 18.512a17.39 17.39 0 0 1-11.587-4.327v13.69a3.882 3.882 0 0 1-3.84 3.333 3.878 3.878 0 0 1-3.84-3.334V12.84a3.882 3.882 0 0 1 3.84-3.333 3.877 3.877 0 0 1 3.84 3.333v.485A17.07 17.07 0 0 1 93.946 8.93ZM123.785 0a3.89 3.89 0 0 1 3.728 2.782c.157.533.197 1.093.119 1.643V9.66h8.18a3.545 3.545 0 0 1 2.536 1.03 3.521 3.521 0 0 1 1.039 2.528 3.572 3.572 0 0 1-1.054 2.513 3.59 3.59 0 0 1-2.521 1.045h-8.18v12.604c0 6.147 3.429 9.288 8.18 9.288.955 0 1.872.38 2.548 1.054a3.594 3.594 0 0 1-2.548 6.14c-9.025 0-15.874-6.35-15.874-16.482V16.777h-2.516a3.59 3.59 0 0 1-2.522-1.045 3.575 3.575 0 0 1-.789-3.881 3.54 3.54 0 0 1 3.311-2.19h2.516V4.425a3.868 3.868 0 0 1 .912-3.088A3.874 3.874 0 0 1 123.785 0ZM45.453 10.653a18.513 18.513 0 0 1 19.68 2.587 4.043 4.043 0 0 1 1.39 2.902 4.002 4.002 0 0 1-1.119 2.796l-10.69 12.758a3.226 3.226 0 0 1-2.644 1.257 3.419 3.419 0 0 1-3.345-2.108 3.444 3.444 0 0 1-.263-1.373 3.144 3.144 0 0 1 .829-2.303l8.414-9.886a8.504 8.504 0 0 0-4.583-1.258c-5.972 0-10.7 5.021-10.7 11.357 0 6.336 4.66 11.356 10.7 11.356a9.956 9.956 0 0 0 7.361-3.143c1.11-.9 1.882-1.732 3.338-1.732a3.593 3.593 0 0 1 3.489 2.243c.185.458.276.948.265 1.442a4.06 4.06 0 0 1-1.119 2.506 17.275 17.275 0 0 1-6.028 4.377 17.233 17.233 0 0 1-7.306 1.426A18.1 18.1 0 0 1 40.01 40.53a18.228 18.228 0 0 1-5.307-13.148 18.637 18.637 0 0 1 2.956-9.927 18.569 18.569 0 0 1 7.794-6.802Zm109.015-.319a18.466 18.466 0 1 1 7.066 35.525 18.147 18.147 0 0 1-18.465-18.465 18.467 18.467 0 0 1 11.399-17.06Zm-126.98-.796a3.512 3.512 0 0 1 2.529 1.033 3.536 3.536 0 0 1 1.03 2.536 3.721 3.721 0 0 1-1.114 2.52L11.145 38.114h16.343a3.513 3.513 0 0 1 2.529 1.034 3.538 3.538 0 0 1 1.03 2.537A3.595 3.595 0 0 1 30 44.203a3.574 3.574 0 0 1-2.512 1.05H3.56a3.593 3.593 0 0 1-2.53-1.08A3.614 3.614 0 0 1 0 41.616a3.82 3.82 0 0 1 1.048-2.53l18.759-22.41H4.374a3.574 3.574 0 0 1-2.51-1.05 3.595 3.595 0 0 1-1.05-2.519A3.54 3.54 0 0 1 3.006 9.8c.434-.178.9-.266 1.368-.26h23.114Zm65.624 6.513c-6.002 0-10.54 4.686-10.753 10.895v.494c0 6.5 4.751 11.391 10.753 11.391s10.753-4.89 10.753-11.39c0-6.5-4.75-11.39-10.753-11.39Zm68.422-.019c-6.126 0-10.732 5.091-10.732 11.363 0 6.27 4.597 11.36 10.732 11.36 6.136 0 10.733-5.157 10.734-11.36 0-6.272-4.608-11.363-10.734-11.363Z"/>
        </svg>
        <p>© 2026 Zepto — AI Smart Grocery Basket Demo · Delivering in 10 minutes ⚡</p>
      </footer>

      {/* Drawers */}
      <SmartBasketDrawer
        isOpen={isSmartBasketOpen}
        onClose={() => setIsSmartBasketOpen(false)}
        recommendations={recommended}
        onAddProduct={addToCart}
        onAddAll={addAll}
        onDismissProduct={id => setDismissedIds(prev => [...prev, id])}
        addedProductIds={addedIds}
        onCheckoutSuccess={checkoutSuccess}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        smartBasketCount={recommended.length}
        unaddedSmartBasketCount={unaddedCount}
        onOpenSmartBasket={() => { setIsCartOpen(false); setIsSmartBasketOpen(true); }}
        onCheckoutSuccess={checkoutSuccess}
      />
      <DemoControls
        simulatedDay={simulatedDay}
        onToggleDay={() => setSimulatedDay(d => d === 'Saturday' ? 'Wednesday' : 'Saturday')}
        onOpenInspector={() => setIsInspectorOpen(true)}
        onReset={reset}
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
