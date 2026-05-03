# Portfolio Journal

> **This project is currently under active development.** Features, APIs, and data structures may change without notice.

A personal journaling web app for tracking and documenting progress across ongoing projects. Entries are stored in AWS DynamoDB and organized by category (tag), making it easy to look back at work done across different disciplines.

---

## Overview

The main goal of this app is to provide a simple, fast interface for logging project updates — whether it's cloud infrastructure work, 3D art, web development, security research, math, or general programming. Each journal entry captures what was worked on, when, and optionally links to relevant resources.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Frontend | React 19 |
| Database | AWS DynamoDB |
| AWS SDK | `@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb` |
| Styling | Custom CSS modules |
| Language | JavaScript (ES Modules) |

---

## Project Structure

```
src/
└── app/
    ├── api/
    │   └── posts/
    │       ├── route.js          # GET (list by tag) + POST (create entry)
    │       └── [id]/
    │           └── route.js      # GET (single entry) + PUT (update entry)
    ├── components/
    │   ├── Navbar.js             # Page header / navigation bar
    │   ├── PostForm.js           # Shared form for create and edit flows
    │   └── travelButton.js       # Home page navigation buttons
    ├── createPost/
    │   └── page.js               # New journal entry page
    ├── editPost/
    │   ├── page.js               # Edit entry list / selector
    │   └── [id]/
    │       └── page.js           # Edit a specific entry by ID
    ├── lib/
    │   └── dbClient.js           # DynamoDB client setup and query helpers
    ├── styles/                   # Page-level CSS
    ├── globals.css
    ├── layout.js
    └── page.js                   # Home page
```

---

## Features

- **Create entries** — log a project update with a title, date, tag, description, and an optional link
- **Edit entries** — update any existing entry via its unique ID
- **Tag-based organization** — entries are categorized into: `Cloud`, `3D Art`, `Web`, `Math`, `Security`, `Programming`
- **DynamoDB backend** — entries are persisted in an AWS DynamoDB table (`journal`) with a GSI (`byTagDate`) for efficient tag-based queries sorted by date
- **Image attachment UI** — file input with preview and remove support (upload integration in progress)

---

## Getting Started

### Prerequisites

- Node.js 18+
- An AWS account with a DynamoDB table named `journal`
- AWS credentials configured locally (via `~/.aws/credentials` or environment variables)

### DynamoDB Table Setup

The table requires:
- **Partition key:** `id` (String)
- **GSI:** `byTagDate` with partition key `tag` (String) and sort key `date` (String)

### Environment Variables

Create a `.env.local` file in the project root (this file is git-ignored and should never be committed):

```env
AWS_REGION=us-west-2
DDB_TABLE=journal
# AWS credentials (if not using a local profile)
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
```

### Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## API Reference

### `GET /api/posts?tag=Cloud&limit=5`

Returns the most recent entries for a given tag, sorted newest first.

| Param | Type | Default | Description |
|---|---|---|---|
| `tag` | string | `Cloud` | Category to filter by |
| `limit` | number | `5` | Max number of entries to return |

### `POST /api/posts`

Creates a new journal entry.

**Body:**
```json
{
  "title": "string (required)",
  "date": "YYYY-MM-DD (required)",
  "tag": "string (required)",
  "description": "string",
  "link": "string (optional URL)"
}
```

### `GET /api/posts/[id]`

Fetches a single entry by its UUID.

### `PUT /api/posts/[id]`

Updates an existing entry. Returns the updated item. Will return `404` if the entry does not exist (uses a DynamoDB `ConditionExpression` to prevent accidental creation).

---

## Roadmap / In Progress

- [ ] Image upload to S3 and display in entries
- [ ] Delete entry support
- [ ] Home page feed showing recent entries by tag
- [ ] Authentication / access control
- [ ] Improved styling and mobile layout
- [ ] Search / filter across all entries

---

## Security Notes

- **Never commit `.env.local`** — it is listed in `.gitignore` and must stay out of version control
- AWS credentials should be managed via IAM roles, environment variables, or `~/.aws/credentials` — not hardcoded
- The API has no authentication layer yet; it is intended for local/personal use during this development phase
