'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { Link as LinkType } from '../../types/link';
import Pagination from './Pagination';
import SortControls from './SortControls';

interface LinkWithUser extends LinkType {
  user?: { id: number; name: string | null; email: string };
}

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const LinkList = ({
  filterTag,
  userId,
  onRefresh,
}: {
  filterTag: string | null;
  userId?: string;
  onRefresh: () => void;
}) => {
  const [links, setLinks] = useState<LinkWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editError, setEditError] = useState('');

  // Pagination and sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchLinks = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterTag) params.append('tag', filterTag);
    if (userId) params.append('userId', userId);
    params.append('page', currentPage.toString());
    params.append('limit', pageSize.toString());
    params.append('orderBy', orderBy);
    params.append('order', order);

    const res = await fetch(`/api/links?${params.toString()}`);
    const data = await res.json();
    setLinks(data.links);
    setPagination(data.pagination);
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTag, userId, currentPage, pageSize, orderBy, order]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handleSortChange = (newOrderBy: string, newOrder: 'asc' | 'desc') => {
    setOrderBy(newOrderBy);
    setOrder(newOrder);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  async function handleDelete(id: number) {
    await fetch('/api/links', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchLinks();
    onRefresh();
  }

  function startEdit(link: LinkWithUser) {
    setEditingId(link.id);
    setEditUrl(link.url);
    setEditTitle(link.title || '');
    setEditTags((link.tags || []).join(', '));
    setEditError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditUrl('');
    setEditTitle('');
    setEditTags('');
    setEditError('');
  }

  async function handleEditSubmit(e: FormEvent<HTMLFormElement>, id: number) {
    e.preventDefault();
    setEditError('');
    const tagArr = editTags
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);
    const res = await fetch('/api/links', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, url: editUrl, title: editTitle, tags: tagArr }),
    });
    if (!res.ok) {
      const data = await res.json();
      setEditError(data.error || 'Failed to update link');
      return;
    }
    cancelEdit();
    fetchLinks();
    onRefresh();
  }

  return (
    <div className="w-full max-w-2xl mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Saved Links</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Show:</label>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <SortControls orderBy={orderBy} order={order} onSortChange={handleSortChange} />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : links.length === 0 ? (
        <div>No links found.</div>
      ) : (
        <>
          <ul className="space-y-2">
            {links.map((link: LinkWithUser) => (
              <li key={link.id} className="border rounded p-3 flex flex-col gap-1 relative">
                {editingId === link.id ? (
                  <form
                    onSubmit={(e) => handleEditSubmit(e, link.id)}
                    className="flex flex-col gap-2"
                  >
                    <input
                      className="border rounded px-2 py-1"
                      type="url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      required
                    />
                    <input
                      className="border rounded px-2 py-1"
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <input
                      className="border rounded px-2 py-1"
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-green-600 text-white rounded px-3 py-1">
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-gray-300 rounded px-3 py-1"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                    {editError && <div className="text-red-600 text-sm">{editError}</div>}
                  </form>
                ) : (
                  <>
                    <button
                      className="absolute top-2 right-16 text-xs text-blue-500 hover:text-blue-700"
                      onClick={() => startEdit(link)}
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs"
                      onClick={() => handleDelete(link.id)}
                      title="Delete"
                    >
                      Delete
                    </button>
                    {/* Show user info */}
                    {link.user && (
                      <div className="text-xs text-gray-700 mb-1">
                        User: {link.user.name || link.user.email}
                      </div>
                    )}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline"
                    >
                      {link.title || link.url}
                    </a>
                    {link.tags && link.tags.length > 0 && (
                      <div className="text-xs text-gray-500">Tags: {link.tags.join(', ')}</div>
                    )}
                    <div className="text-xs text-gray-400">
                      Added: {new Date(link.createdAt).toLocaleString()}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          {pagination && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 text-center mb-2">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{' '}
                {pagination.totalCount} links
              </div>
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LinkList;
