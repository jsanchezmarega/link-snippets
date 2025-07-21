"use client";
import React, { useState, useEffect, FormEvent } from "react";

const LinkList = ({ filterTag, onRefresh }: { filterTag: string | null; onRefresh: () => void }) => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editError, setEditError] = useState("");

  const fetchLinks = async () => {
    setLoading(true);
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  async function handleDelete(id: number) {
    await fetch("/api/links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchLinks();
    onRefresh();
  }

  function startEdit(link: any) {
    setEditingId(link.id);
    setEditUrl(link.url);
    setEditTitle(link.title || "");
    setEditTags((link.tags || []).join(", "));
    setEditError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditUrl("");
    setEditTitle("");
    setEditTags("");
    setEditError("");
  }

  async function handleEditSubmit(e: FormEvent<HTMLFormElement>, id: number) {
    e.preventDefault();
    setEditError("");
    const tagArr = editTags.split(",").map((t: string) => t.trim()).filter(Boolean);
    const res = await fetch("/api/links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, url: editUrl, title: editTitle, tags: tagArr }),
    });
    if (!res.ok) {
      const data = await res.json();
      setEditError(data.error || "Failed to update link");
      return;
    }
    cancelEdit();
    fetchLinks();
    onRefresh();
  }

  // Filter links by tag if filterTag is set
  const filteredLinks = filterTag
    ? links.filter((link) => link.tags && link.tags.includes(filterTag))
    : links;

  return (
    <div className="w-full max-w-2xl mt-8">
      <h2 className="text-lg font-semibold mb-2">Saved Links</h2>
      {loading ? (
        <div>Loading...</div>
      ) : filteredLinks.length === 0 ? (
        <div>No links yet.</div>
      ) : (
        <ul className="space-y-2">
          {filteredLinks.map((link) => (
            <li key={link.id} className="border rounded p-3 flex flex-col gap-1 relative">
              {editingId === link.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, link.id)} className="flex flex-col gap-2">
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
                    <button type="submit" className="bg-green-600 text-white rounded px-3 py-1">Save</button>
                    <button type="button" className="bg-gray-300 rounded px-3 py-1" onClick={cancelEdit}>Cancel</button>
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
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                    {link.title || link.url}
                  </a>
                  {link.tags && link.tags.length > 0 && (
                    <div className="text-xs text-gray-500">Tags: {link.tags.join(", ")}</div>
                  )}
                  <div className="text-xs text-gray-400">Added: {new Date(link.createdAt).toLocaleString()}</div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LinkList; 