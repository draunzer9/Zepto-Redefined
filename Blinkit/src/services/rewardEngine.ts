import type { Order } from '../types';

export const REWARD_MILESTONES = [
  { orders: 10, reward: '5 KG Aashirvaad Atta', icon: '🌾' },
  { orders: 15, reward: '10 KG Basmati Rice', icon: '🍚' },
  { orders: 20, reward: 'Premium Grocery Hamper', icon: '🎁' }
];

export class RewardEngine {
  static getQualifyingOrders(orders: Order[]): number {
    return orders.filter(o => o.totalAmount >= 500).length;
  }

  static getRewardState(qualifyingOrders: number) {
    let currentMilestoneIndex = REWARD_MILESTONES.findIndex(m => m.orders > qualifyingOrders);
    
    if (currentMilestoneIndex === -1) {
      // 20+ orders
      return {
        qualifyingOrders,
        nextMilestone: null,
        progressPercentage: 100,
        ordersRemaining: 0,
        unlockedRewards: REWARD_MILESTONES,
        upcomingRewards: []
      };
    }
    
    const nextMilestone = REWARD_MILESTONES[currentMilestoneIndex];
    // Progress calculation should just be overall out of next milestone for simplicity like Blinkit
    const progressPercentage = Math.round((qualifyingOrders / nextMilestone.orders) * 100);
    
    return {
      qualifyingOrders,
      nextMilestone,
      progressPercentage,
      ordersRemaining: nextMilestone.orders - qualifyingOrders,
      unlockedRewards: REWARD_MILESTONES.slice(0, currentMilestoneIndex),
      upcomingRewards: REWARD_MILESTONES.slice(currentMilestoneIndex)
    };
  }
}
