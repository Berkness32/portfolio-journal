"use client";

import "../mainStyle.css";
import React, { useState } from 'react';

export default function CreatePost() {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <>
      <h1>
        Create New Post
      </h1>

      <hr />

      <form>
        <textarea
          id="multiline-text"
          value={text}
          onChange={handleChange}
          rows={5} // Optional: Specifies the visible number of lines
          cols={40} // Optional: Specifies the visible width in average character widths
          placeholder="Type your message here..." // Optional: Placeholder text
        />
      </form>
    </>
  );
}
