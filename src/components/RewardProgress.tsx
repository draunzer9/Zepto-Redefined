import { RewardEngine } from '../services/rewardEngine';

interface Props {
  qualifyingOrders: number;
  onViewRewards: () => void;
}

export function RewardProgress({ qualifyingOrders, onViewRewards }: Props) {
  const state = RewardEngine.getRewardState(qualifyingOrders);

  return (
    <div className="reward-card" onClick={onViewRewards} style={{ cursor: 'pointer', background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #E8E8E8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#171717', marginBottom: '4px' }}>Shop more. Unlock more. 🎁</h3>
          <p style={{ fontSize: '13px', color: '#737373', margin: 0 }}>Complete ₹500+ orders to unlock exclusive grocery rewards.</p>
        </div>
        <div style={{ background: '#FFF4D1', color: '#E5B426', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
          {state.qualifyingOrders} / {state.nextMilestone?.orders || 20} orders
        </div>
      </div>

      <div style={{ background: '#F5F5F5', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
        <div style={{ width: `\${state.progressPercentage}%`, background: '#0C831F', height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' }} />
      </div>

      {state.nextMilestone ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: '#E8F5E9', padding: '6px', borderRadius: '8px', fontSize: '18px' }}>{state.nextMilestone.icon}</div>
          <div>
            <div style={{ fontSize: '12px', color: '#737373', fontWeight: 600 }}>{state.ordersRemaining} more qualifying orders to unlock:</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#171717' }}>{state.nextMilestone.reward}</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: '#E8F5E9', padding: '6px', borderRadius: '8px', fontSize: '18px' }}>🎉</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#171717' }}>All rewards unlocked!</div>
        </div>
      )}
    </div>
  );
}
