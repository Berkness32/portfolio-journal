"use client";

import Link from "next/link";
import "../styles/createPost.css"; // or wherever your CSS lives

export default function Navbar({ title }) {
  return (
    <div className="navbar">
      <Link href="/">Home</Link>
      <h1>{title}</h1>
    </div>
  );
}
