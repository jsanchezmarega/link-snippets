'use client';
import React from 'react';

interface SortControlsProps {
  orderBy: string;
  order: 'asc' | 'desc';
  onSortChange: (orderBy: string, order: 'asc' | 'desc') => void;
}

const SortControls = ({ orderBy, order, onSortChange }: SortControlsProps) => {
  const sortOptions = [
    { value: 'createdAt', label: 'Date Added' },
    { value: 'title', label: 'Title' },
    { value: 'url', label: 'URL' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Sort by:</label>
      <select
        value={orderBy}
        onChange={(e) => onSortChange(e.target.value, order)}
        className="border rounded px-2 py-1 text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => onSortChange(orderBy, order === 'asc' ? 'desc' : 'asc')}
        className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
        title={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
      >
        {order === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
};

export default SortControls;
