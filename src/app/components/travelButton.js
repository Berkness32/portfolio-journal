"use client";

import Link from 'next/link'

function CreatePost() {
  return (
    <Link href="/createPost">
      Create Post
    </Link>
  );
}

function EditPost() {
  return (
    <Link href="/createPost">
      Edit Post 
    </Link>
  );
}

function DeletePost() {
  return (
    <Link href="/createPost">
      Delete Post 
    </Link>
  );
}

export default function HomeButtons() {

  return (
    <div className="btnColumn">
      <nav>
        <CreatePost />
        <EditPost />
        <DeletePost />
      </nav>
    </div>
  );
}
