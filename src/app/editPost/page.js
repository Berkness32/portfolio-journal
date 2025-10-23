"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/editPosts.css";

export default function EditPost() {
  const [posts, setPosts] = useState([]);      // must be an array
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // explicit loading flag

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts?tag=Cloud&limit=5", { cache: "no-store" });
        const data = await res.json();
        console.log("Fetched data (raw):", data);

        if (!res.ok) throw new Error(data?.error || "Failed to fetch");

        // normalize to an array no matter what the API returns
        const arr = Array.isArray(data) ? data : (data?.Items ?? []);
        setPosts(arr);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar title="Edit Post" />
      <hr />

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
