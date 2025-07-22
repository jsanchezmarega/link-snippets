'use client';
import LinkForm from './components/LinkForm';
import LinkList from './components/LinkList';
import TagFilter from './components/TagFilter';
import SearchBar from './components/SearchBar';
import React, { useState, useEffect } from 'react';
import { Link } from '../types/link';

export default function Home() {
  const [refresh, setRefresh] = useState(0);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string; email: string }[]>([]);
  const [userFilter, setUserFilter] = useState<string>('');

  // Fetch all tags for filtering
  useEffect(() => {
    async function fetchTags() {
      const res = await fetch('/api/links');
      const data = await res.json();
      const tags = Array.from(new Set(data.links.flatMap((l: Link) => l.tags || []))) as string[];
      setAllTags(tags);
    }
    fetchTags();
  }, [refresh]);

  // Fetch users for filter
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <h1 className="text-2xl font-bold mb-4">Link Notes</h1>
      <LinkForm onAdd={() => setRefresh((r) => r + 1)} />

      <div className="w-full max-w-2xl">
        <div className="mb-4">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search by title, URL, or tags..."
          />
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          <select
            className="border rounded px-2 py-1"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            <option value="">All users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
          <TagFilter allTags={allTags} filterTag={filterTag} setFilterTag={setFilterTag} />
        </div>
      </div>

      <div className="w-full flex justify-center">
        <LinkList
          key={`${refresh}-${filterTag}-${userFilter}-${searchTerm}`}
          filterTag={filterTag}
          userId={userFilter}
          searchTerm={searchTerm}
          onRefresh={() => setRefresh((r) => r + 1)}
        />
      </div>
    </div>
  );
}
