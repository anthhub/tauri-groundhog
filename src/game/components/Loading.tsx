import React from 'react';

export function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <div className="loading-text">加载中...</div>
    </div>
  );
}
