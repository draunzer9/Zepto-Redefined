import React from 'react';

interface DemoControlsProps {
  simulatedDay: 'Saturday' | 'Wednesday';
  onToggleDay: () => void;
  onOpenInspector: () => void;
  onReset: () => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  simulatedDay, onToggleDay, onOpenInspector, onReset,
}) => (
  <div className="demo-controls">
    <div className="demo-controls-title">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFC107"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
      Demo Controls
    </div>
    <button className="demo-day-btn" onClick={onToggleDay}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E01A76" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <div>
        <div className="demo-day-label">Simulated Day</div>
        <div className="demo-day-val">{simulatedDay}</div>
      </div>
    </button>
    <div className="demo-btns">
      <button className="demo-inspect-btn" onClick={onOpenInspector}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        Inspect AI
      </button>
      <button className="demo-reset-btn" onClick={onReset}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"><path d="M3 2v6h6"/><path d="M3 13a9 9 0 1 0 3-7.7L3 8"/></svg>
        Reset
      </button>
    </div>
  </div>
);
