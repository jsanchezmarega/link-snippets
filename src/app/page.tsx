'use client';
import LinkForm from "./components/LinkForm";
import LinkList from "./components/LinkList";
import TagFilter from "./components/TagFilter";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [refresh, setRefresh] = useState(0);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch all tags for filtering
  useEffect(() => {
    async function fetchTags() {
      const res = await fetch("/api/links");
      const data = await res.json();
      const tags = Array.from(new Set(data.flatMap((l: any) => l.tags || []))) as string[];
      setAllTags(tags);
    }
    fetchTags();
  }, [refresh]);

  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <h1 className="text-2xl font-bold mb-4">Link Notes</h1>
      <LinkForm onAdd={() => setRefresh((r) => r + 1)} />
      <TagFilter allTags={allTags} filterTag={filterTag} setFilterTag={setFilterTag} />
      {/* Key forces remount to refresh list after adding or deleting */}
      <div className="w-full flex justify-center">
        <LinkList key={refresh + '-' + filterTag} filterTag={filterTag} onRefresh={() => setRefresh((r) => r + 1)} />
      </div>
    </div>
  );
}
