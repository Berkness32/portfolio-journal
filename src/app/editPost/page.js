"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/editPosts.css";

export default function EditPost() {
  const TAG_OPTIONS = ["Cloud", "3D Art", "Web", "Math", "Security", "Programming"];

  const [posts, setPosts] = useState([]);      // must be an array
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // explicit loading flag
  const [tag, setTag] = useState(TAG_OPTIONS[0]);

  useEffect(() => { 
    const ac = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError("");
        
        const res = await fetch(
          `/api/posts?tag=${tag}&limit=5`, 
          { cache: "no-store", signal: ac.signal }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch");

        const arr = Array.isArray(data) ? data : (data?.Items ?? []);
        setPosts(arr);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching posts:", err);
          setError(err.message || String(err));
        }
      } finally {
        setLoading(false);
      }
    }

    load()
    return () => ac.abort();
  }, [tag]);

  return (
    <>
      <Navbar title="Edit Post" />
      <hr />

      <select
        id="tag"
        name="tag"
        className="tag-input"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      >
        {TAG_OPTIONS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {!loading && !error && posts.length === 0 && <p>No posts found.</p>}

      {!loading && !error && posts.length > 0 && (
        <ul>
          {posts.map((p, i) => (
            <li key={p.id ?? `${p.tag}-${p.date}-${i}`}>
              <strong>{p.title ?? "(untitled)"}</strong>
              {" — "}
              {p.date ?? "(no date)"} {p.tag ? `· ${p.tag}` : ""}
              <br />
              <hr />
              <br />

              {p.description}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
