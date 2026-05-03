"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostForm from "../../components/PostForm";
import Navbar from "../../components/Navbar";

export default function EditPostPage() {
  const { id } = useParams();            // /editPost/[id]
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load post");
        if (alive) setPost(data);        // expect { id, title, date, description, tag, link }
      } catch (e) {
        if (alive) setErr(e.message || String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  async function handleUpdate(payload) {
    const res = await fetch(`/api/posts/${payload.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Updating from id page. ")

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || "Update failed");
    }

    // Let PostForm decide what message to show
    return data;
  }

  return (
    <>
      <Navbar title="Edit Post" />
      <hr />
      {loading && <p>Loading…</p>}
      {err && <p style={{ color: "crimson" }}>Error: {err}</p>}
      {!loading && !err && post && (
        <PostForm initialData={post} onSubmit={handleUpdate} />
      )}
    </>
  );
}
