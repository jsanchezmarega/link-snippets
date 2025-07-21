'use client';
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';

const LinkForm = ({ onAdd }: { onAdd: () => void }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState<{ id: number; name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!url) {
      setError('URL is required');
      setLoading(false);
      return;
    }
    if (!userId) {
      setError('User is required');
      setLoading(false);
      return;
    }
    setLoading(true);
    const tagArr = tags
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, title, tags: tagArr, userId }),
      });
      setLoading(false);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to add link');
        return;
      }
      setUrl('');
      setTitle('');
      setTags('');
      setUserId('');
      onAdd();
    } catch {
      setLoading(false);
      setError('Failed to add link');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-md">
      <label className="flex flex-col gap-1">
        User
        <select
          className="border rounded px-2 py-1"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">Select user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.email}
            </option>
          ))}
        </select>
      </label>
      <input
        className="border rounded px-2 py-1"
        type="url"
        placeholder="URL*"
        value={url}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        type="text"
        placeholder="Title (optional)"
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white rounded px-4 py-2 mt-2 disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Link'}
      </button>
      {error && (
        <div data-testid="form-error" className="text-red-600 text-sm">
          {error}
        </div>
      )}
    </form>
  );
};

export default LinkForm;
