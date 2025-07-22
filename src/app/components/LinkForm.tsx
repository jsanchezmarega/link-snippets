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
  const [fetchingTitle, setFetchingTitle] = useState(false);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // Auto-fetch title when URL is entered
  useEffect(() => {
    const fetchTitle = async () => {
      if (!url || !isValidUrl(url)) return;

      setFetchingTitle(true);
      try {
        const res = await fetch('/api/fetch-title', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.title && !title) {
            setTitle(data.title);
          }
        }
      } catch (error) {
        console.error('Failed to fetch title:', error);
      } finally {
        setFetchingTitle(false);
      }
    };

    const timeoutId = setTimeout(fetchTitle, 1000); // Debounce
    return () => clearTimeout(timeoutId);
  }, [url, title]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to submit form
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.querySelector('form');
        if (form) {
          e.preventDefault();
          form.requestSubmit();
        }
      }

      // Escape to clear form
      if (e.key === 'Escape') {
        setUrl('');
        setTitle('');
        setTags('');
        setUserId('');
        setError('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!url) {
      setError('URL is required');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    if (!userId) {
      setError('User is required');
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
      setError('Failed to add link');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-md">
      <div className="text-xs text-gray-500 mb-2">
        💡 Tip: Use Ctrl+Enter to submit, Escape to clear
      </div>

      <label className="flex flex-col gap-1">
        User *
        <select
          className="border rounded px-2 py-1"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          aria-describedby="user-help"
        >
          <option value="">Select user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.email}
            </option>
          ))}
        </select>
        <span id="user-help" className="text-xs text-gray-500">
          Choose who this link belongs to
        </span>
      </label>

      <div className="flex flex-col gap-1">
        <label htmlFor="url-input" className="text-sm font-medium">
          URL *
        </label>
        <input
          id="url-input"
          className={`border rounded px-2 py-1 ${url && !isValidUrl(url) ? 'border-red-500' : ''}`}
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
          required
          aria-describedby="url-help"
          autoFocus
        />
        {url && !isValidUrl(url) && (
          <span className="text-red-500 text-xs">Please enter a valid URL</span>
        )}
        <span id="url-help" className="text-xs text-gray-500">
          The webpage URL you want to save
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="title-input" className="text-sm font-medium">
          Title
        </label>
        <div className="relative">
          <input
            id="title-input"
            className="border rounded px-2 py-1 w-full"
            type="text"
            placeholder="Page title (optional)"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            aria-describedby="title-help"
          />
          {fetchingTitle && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        <span id="title-help" className="text-xs text-gray-500">
          Auto-fetched from the webpage
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tags-input" className="text-sm font-medium">
          Tags
        </label>
        <input
          id="tags-input"
          className="border rounded px-2 py-1"
          type="text"
          placeholder="react, typescript, tutorial (comma separated)"
          value={tags}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
          aria-describedby="tags-help"
        />
        <span id="tags-help" className="text-xs text-gray-500">
          Separate multiple tags with commas
        </span>
      </div>

      <button
        className="bg-blue-600 text-white rounded px-4 py-2 mt-2 disabled:opacity-50 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        type="submit"
        disabled={loading || !url || !isValidUrl(url) || !userId}
        aria-describedby="submit-help"
      >
        {loading ? 'Adding...' : 'Add Link'}
      </button>
      <span id="submit-help" className="text-xs text-gray-500">
        Ctrl+Enter to submit quickly
      </span>

      {error && (
        <div data-testid="form-error" className="text-red-600 text-sm" role="alert">
          {error}
        </div>
      )}
    </form>
  );
};

export default LinkForm;
