"use client";

import { useEffect, useMemo, useState, } from "react";
import Image from "next/image";

// Helper: format today's date in local time for <input type="date" />
function todayLocalYYYYMMDD() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Example tag list (you can also pass this as a prop)
const TAG_OPTIONS = ["Cloud", "3D Art", "Web", "Math", "Security", "Programming"];

export default function PostForm({ onSubmit }) {
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

    const data = {
      title: form.title.trim(),
      date: form.date, // "YYYY-MM-DD"
      description: form.description.trim(),
      tag: form.tag,
      link: form.link.trim() || null,
      // We’ll pass the File separately (don’t try to JSON.stringify a File)
      imageFile, // File | null
    };

    if (!data.title) {
      alert("Please enter a title.");
      return;
    }
    if (!isValidUrl(data.link || "")) {
      alert("Please enter a valid link (or leave it blank).");
      return;
    }

    console.log("Submitting:", data);

    if (onSubmit) {
      // Let the parent decide how to handle files (S3, etc.)
      await onSubmit(data);
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
