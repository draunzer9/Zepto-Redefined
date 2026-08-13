import { RewardEngine } from '../services/rewardEngine';

interface Props {
  qualifyingOrdersBefore: number;
  orderValue: number;
  onBackToHome: () => void;
}

export function OrderConfirmation({ qualifyingOrdersBefore, orderValue, onBackToHome }: Props) {
  const isQualifying = orderValue >= 500;
  const qualifyingOrdersNow = qualifyingOrdersBefore + (isQualifying ? 1 : 0);
  
  const stateBefore = RewardEngine.getRewardState(qualifyingOrdersBefore);
  const stateNow = RewardEngine.getRewardState(qualifyingOrdersNow);

  const unlockedNewReward = stateNow.unlockedRewards.length > stateBefore.unlockedRewards.length;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', background: '#E8F5E9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#0C831F' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      
      <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#171717', marginBottom: '8px' }}>Order Placed!</h2>
      <p style={{ fontSize: '15px', color: '#525252', marginBottom: '32px' }}>Your groceries will arrive in 10 minutes ⚡</p>

      {isQualifying ? (
        <div style={{ background: '#FFF4D1', border: '1px solid #F8CB46', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
          
          {unlockedNewReward ? (
            <>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#171717', marginBottom: '8px' }}>Congratulations!</h3>
              <p style={{ fontSize: '14px', color: '#525252', marginBottom: '16px' }}>
                You've reached {qualifyingOrdersNow} qualifying orders and unlocked:
              </p>
              <div style={{ background: 'white', padding: '12px', borderRadius: '12px', fontSize: '16px', fontWeight: 700, color: '#0C831F' }}>
                {stateNow.unlockedRewards[stateNow.unlockedRewards.length - 1].reward}
              </div>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#171717', marginBottom: '8px' }}>
                This order qualifies toward your next reward!
              </h3>
              <p style={{ fontSize: '14px', color: '#525252' }}>
                You now have {qualifyingOrdersNow} qualifying orders. 
                {stateNow.ordersRemaining > 0 && ` Just \${stateNow.ordersRemaining} more to unlock \${stateNow.nextMilestone?.reward}!`}
              </p>
            </>
          )}
        </div>
      ) : (
        <div style={{ background: '#F5F5F5', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <p style={{ fontSize: '14px', color: '#525252' }}>
            This order was under ₹500, so it didn't count toward your reward milestones.
            Shop for ₹500 or more next time to earn rewards!
          </p>
        </div>
      )}

      <button 
        onClick={onBackToHome}
        style={{ 
          width: '100%', padding: '16px', borderRadius: '12px', 
          background: '#0C831F', color: 'white', 
          fontSize: '16px', fontWeight: 800,
          border: 'none', cursor: 'pointer'
        }}
      >
        Back to Home
      </button>
    </div>
  );
}
