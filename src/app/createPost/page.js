"use client";

import React from 'react';
import PostForm from '../components/PostForm';
import Navbar from '../components/Navbar';

export default function CreatePost() {

  return (
    <>

      <Navbar title={"Create New Post"} />

      <hr />

      <PostForm  />

    </>
  );
}
