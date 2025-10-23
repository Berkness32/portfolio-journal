"use client";

import { useEffect, useMemo, useState, } from "react";

function todayLocalYYYYMMDD() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const TAG_OPTIONS = ["Cloud", "3D Art", "Web", "Math", "Security", "Programming"];

export default function PostForm() {
  const [form, setForm] = useState({
    title: "",
    date: todayLocalYYYYMMDD(),
    description: "",
    tag: TAG_OPTIONS[0],       // default to first tag
    link: "",                  // optional
  });

  // Image handling
  const [imageFile, setImageFile] = useState(null);       // File | null
  const imagePreviewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  );
  useEffect(() => {
    // cleanup object URL to avoid memory leaks
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  }

  function removeImage() {
    setImageFile(null);
  }

  function isValidUrl(url) {
    if (!url) return true; // optional, empty is OK
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

async function handleSubmit(e) {
  e.preventDefault();

  const payload = {
    title: form.title.trim(),
    date: form.date,             // "YYYY-MM-DD"
    tag: form.tag,
    link: form.link.trim() || "", 
    description: form.description.trim(),
  };

  if (!payload.title) {
    alert("Please enter a title.");
    return;
  }
  if (!isValidUrl(payload.link || "")) {
    alert("Please enter a valid link (or leave it blank).");
    return;
  }

  try {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error);
    }

    const { id } = await res.json(); // returned by server
    alert(`Post saved! id: ${id}`);

    // reset form
    setForm({
      title: "",
      date: todayLocalYYYYMMDD(),
      description: "",
      tag: TAG_OPTIONS[0],
      link: "",
    });
    setImageFile(null);
  } catch (err) {
    console.error("Save failed:", err);
    alert(`Failed to save post: ${err.message}`);
  }
}

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <input
        id="title"
        name="title"
        className="title-input"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <div className="date-and-tag">
        {/* Date */}
        <input
          id="date"
          type="date"
          name="date"
          className="date-input"
          value={form.date}
          onChange={handleChange}
          required
        />

        {/* Tag dropdown */}
        <select
          id="tag"
          name="tag"
          className="tag-input"
          value={form.tag}
          onChange={handleChange}
        >
          {TAG_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Optional link */}
      <input
        id="link"
        name="link"
        type="url"
        className="url-input"
        placeholder="https://example.com"
        value={form.link}
        onChange={handleChange}
        inputMode="url"
      />

      {/* Optional image */}
      <input
        id="image"
        name="image"
        className="image-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* Preview + remove */}
      {imagePreviewUrl && (
        <div style={{ marginTop: "0.5rem" }}>
          <img
            src={imagePreviewUrl}
            alt="Selected preview"
            style={{ maxWidth: "200px", display: "block", marginBottom: "0.5rem" }}
          />
          <button type="button" onClick={removeImage}>
            Remove image
          </button>
        </div>
      )}

      {/* Description */}
      <textarea
        id="description"
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={10}
        cols={50}
        placeholder="Type your message here..."
      />

      <button type="submit">Submit</button>
    </form>
  );
}
