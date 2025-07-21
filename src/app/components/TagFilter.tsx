'use client';
import React from 'react';

const TagFilter = ({
  allTags,
  filterTag,
  setFilterTag,
}: {
  allTags: string[];
  filterTag: string | null;
  setFilterTag: (tag: string | null) => void;
}) => (
  <div className="flex gap-2 flex-wrap mt-4">
    <button
      className={`px-3 py-1 rounded ${filterTag === null ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      onClick={() => setFilterTag(null)}
    >
      All
    </button>
    {allTags.map((tag) => (
      <button
        key={tag}
        className={`px-3 py-1 rounded ${filterTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => setFilterTag(tag)}
      >
        {tag}
      </button>
    ))}
  </div>
);

export default TagFilter;
