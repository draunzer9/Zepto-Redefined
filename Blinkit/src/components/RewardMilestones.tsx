import { REWARD_MILESTONES } from '../services/rewardEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  qualifyingOrders: number;
}

export function RewardMilestones({ isOpen, onClose, qualifyingOrders }: Props) {
  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose} style={{ zIndex: 300, justifyContent: 'center', alignItems: 'center' }}>
      <div 
        onClick={e => e.stopPropagation()} 
        style={{ 
          background: 'white', 
          width: '90%', 
          maxWidth: '400px', 
          borderRadius: '16px', 
          padding: '24px', 
          position: 'relative',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: '#F5F5F5', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎁</div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#171717' }}>Your Blinkit Rewards</h2>
          <p style={{ fontSize: '13px', color: '#737373', marginTop: '4px' }}>Every order over ₹500 counts towards your next milestone.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {REWARD_MILESTONES.map(milestone => {
            const isUnlocked = qualifyingOrders >= milestone.orders;
            const isNext = qualifyingOrders < milestone.orders && (!REWARD_MILESTONES.find(m => m.orders > qualifyingOrders) || REWARD_MILESTONES.find(m => m.orders > qualifyingOrders)?.orders === milestone.orders);

            return (
              <div key={milestone.orders} style={{ 
                border: `1.5px solid \${isUnlocked ? '#0C831F' : isNext ? '#F8CB46' : '#E8E8E8'}`, 
                borderRadius: '12px', 
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: isUnlocked ? '#E8F5E9' : 'white',
                opacity: isUnlocked || isNext ? 1 : 0.6
              }}>
                <div style={{ fontSize: '24px' }}>{milestone.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: isUnlocked ? '#0C831F' : '#737373', textTransform: 'uppercase' }}>
                    {milestone.orders} Orders
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#171717' }}>{milestone.reward}</div>
                </div>
                <div>
                  {isUnlocked ? (
                    <div style={{ color: '#0C831F' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                  ) : isNext ? (
                    <div style={{ fontSize: '11px', fontWeight: 700, background: '#FFF4D1', color: '#E5B426', padding: '4px 8px', borderRadius: '8px' }}>
                      IN PROGRESS
                    </div>
                  ) : (
                    <div style={{ color: '#A3A3A3' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
