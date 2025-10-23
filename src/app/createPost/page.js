"use client";

import React from 'react';
import PostForm from '../components/PostForm';
import Navbar from '../components/Navbar';

export default function CreatePost() {

  async function handlePostSubmit(data) {
    console.log("Received in page:", data);

    // In the future, send it to AWS
    // await fetch("/api/submit", { method: "POST", body: JSON.stringify(data) });
  }

  return (
    <>

      <Navbar title={"Create New Post"} />

      <hr />

      <PostForm onSubmit={handlePostSubmit} />

    </>
  );
}
