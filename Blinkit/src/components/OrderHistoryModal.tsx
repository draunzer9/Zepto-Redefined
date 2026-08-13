import React from 'react';
import { DEMO_ORDER_HISTORY } from '../data/demoData';
import type { RecommendationScoreDetails } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  scoreDetailsMap: Record<string, RecommendationScoreDetails>;
  simulatedDay: string;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen, onClose, scoreDetailsMap, simulatedDay,
}) => {
  if (!isOpen) return null;
  const scoreList = Object.values(scoreDetailsMap).sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="inspector-overlay" onClick={onClose}>
      <div className="inspector-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="inspector-header">
          <div>
            <div className="inspector-title">Smart Basket Algorithm Inspector</div>
            <div className="inspector-sub">Auditor view of historical order logs &amp; deterministic scoring</div>
          </div>
          <button className="drawer-close-btn" onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="inspector-body">
          <div className="inspector-note">
            <strong>Behind-the-Scenes Inspection:</strong> The customer-facing UI displays NO explanations or metrics.
            This modal exposes the engine's real-time score calculation and order logs for reviewer inspection.
          </div>

          {/* Scores table */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#171717' }}>📊 Product Recommendation Scores</h4>
              <span className="sat-chip">Simulated: {simulatedDay}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="inspector-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Median Interval</th>
                    <th>Purchases</th>
                    <th>Saturday Pattern</th>
                    <th style={{ textAlign: 'right' }}>Score</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreList.map(item => {
                    const passed = item.totalScore >= 45;
                    return (
                      <tr key={item.productId}>
                        <td style={{ fontWeight: 600, color: '#262626' }}>{item.productName}</td>
                        <td>{item.medianIntervalDays} days</td>
                        <td>{item.purchaseCount} orders</td>
                        <td>
                          {item.isSaturdayPattern
                            ? <span className="sat-chip">YES (Sat)</span>
                            : <span style={{ color: '#A3A3A3', fontSize: 11 }}>No</span>
                          }
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="score-val">{item.totalScore.toFixed(0)}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {passed
                            ? <span className="recommended-chip">✓ Recommended</span>
                            : <span style={{ background: '#F4F4F5', color: '#737373', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, whiteSpace: 'nowrap' }}>Below Threshold</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order history */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#171717', marginBottom: 12 }}>
              📋 Historical Orders ({DEMO_ORDER_HISTORY.length} orders)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {DEMO_ORDER_HISTORY.slice().reverse().map(order => (
                <div
                  key={order.orderId}
                  style={{
                    background: 'white',
                    border: '1px solid #E8E8E8',
                    borderRadius: 10,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, color: '#171717' }}>{order.orderDate}</span>
                      <span className="sat-chip">{order.dayOfWeek}</span>
                    </div>
                    <div style={{ color: '#737373', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>
                      {order.items.map(i => `${i.productName} ×${i.quantity}`).join(', ')}
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: '#171717', flexShrink: 0 }}>₹{order.totalAmount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', background: '#FAFAFA', borderTop: '1px solid #E8E8E8', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ background: '#3B0066', color: 'white', fontWeight: 700, fontSize: 13, padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer' }}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
