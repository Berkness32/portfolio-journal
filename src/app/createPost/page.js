"use client";

import React from 'react';
import PostForm from '../components/PostForm';
import '../styles/createPost.css';

export default function CreatePost() {

  async function handlePostSubmit(data) {
    console.log("Received in page:", data);

    // In the future, send it to AWS
    // await fetch("/api/submit", { method: "POST", body: JSON.stringify(data) });
  }

  return (
    <>
      <h1>
        Create New Post
      </h1>

      <hr />

      <PostForm onSubmit={handlePostSubmit} />

    </>
  );
}
