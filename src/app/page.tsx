'use client';
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";

function LinkForm({ onAdd }: { onAdd: () => void }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const tagArr = tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title, tags: tagArr }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to add link");
      return;
    }
    setUrl("");
    setTitle("");
    setTags("");
    onAdd();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-md">
      <input
        className="border rounded px-2 py-1"
        type="url"
        placeholder="URL*"
        value={url}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
        required
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
        {loading ? "Adding..." : "Add Link"}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
}

function LinkList() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="w-full max-w-2xl mt-8">
      <h2 className="text-lg font-semibold mb-2">Saved Links</h2>
      {loading ? (
        <div>Loading...</div>
      ) : links.length === 0 ? (
        <div>No links yet.</div>
      ) : (
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.id} className="border rounded p-3 flex flex-col gap-1">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                {link.title || link.url}
              </a>
              {link.tags && link.tags.length > 0 && (
                <div className="text-xs text-gray-500">Tags: {link.tags.join(", ")}</div>
              )}
              <div className="text-xs text-gray-400">Added: {new Date(link.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Home() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <h1 className="text-2xl font-bold mb-4">Link Notes</h1>
      <LinkForm onAdd={() => setRefresh((r) => r + 1)} />
      {/* Key forces remount to refresh list after adding */}
      <div className="w-full flex justify-center">
        <LinkList key={refresh} />
      </div>
    </div>
  );
}
