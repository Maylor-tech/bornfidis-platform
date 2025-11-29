# Content Management Guide

This document explains the current content layer implementation and how to migrate to a headless CMS like Sanity or Contentful in the future.

## Current Implementation: Markdown Files

The platform currently uses a lightweight markdown-based content layer located in `/content`.

### Structure

```
/content
  /pages          # Static pages (About, Contact, Legal, etc.)
  /posts          # Blog posts and articles
```

### How It Works

1. **Content Files**: Markdown files (`.md`) with frontmatter metadata
2. **Content Utilities**: `lib/content.ts` provides functions to read and parse content
3. **Markdown Processing**: `lib/markdown.ts` converts markdown to HTML using `remark`

### Example Content File

```markdown
---
title: About Us
description: Learn about our company
date: 2024-01-15
author: John Doe
---

# About Us

Content goes here...
```

### Usage in Components

```typescript
import { getContentItem, markdownToHtml } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'

// Get a page
const page = getContentItem('pages', 'about')
const html = await markdownToHtml(page.content)

// Get all posts
const posts = getContentItems('posts')
```

## Advantages of Current System

- ✅ **Simple**: No external dependencies or services
- ✅ **Fast**: Files are read directly from the filesystem
- ✅ **Version Control**: Content is tracked in Git
- ✅ **Free**: No hosting costs for content
- ✅ **Developer-Friendly**: Easy to edit and deploy

## Limitations

- ❌ **No Admin UI**: Requires editing markdown files directly
- ❌ **No Real-time Preview**: Changes require deployment
- ❌ **Limited Collaboration**: Not ideal for non-technical content editors
- ❌ **No Media Management**: Images must be managed separately
- ❌ **No Content Relationships**: Limited ability to link content

## Migration to Headless CMS

When you're ready to scale content management, consider migrating to a headless CMS. Here are two popular options:

### Option 1: Sanity

**Why Sanity?**
- Excellent developer experience
- Real-time collaboration
- Powerful content modeling
- Built-in image optimization
- Free tier available

**Migration Steps:**

1. **Install Sanity**:
   ```bash
   npm install @sanity/client @sanity/image-url
   ```

2. **Create Sanity Project**:
   - Sign up at [sanity.io](https://sanity.io)
   - Create a new project
   - Set up schemas for pages and posts

3. **Update Content Utilities** (`lib/content.ts`):
   ```typescript
   import { createClient } from '@sanity/client'

   const client = createClient({
     projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
     dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
     useCdn: true,
     apiVersion: '2024-01-01',
   })

   export async function getContentItems(type: 'pages' | 'posts') {
     return await client.fetch(`*[_type == "${type}"]`)
   }
   ```

4. **Migrate Content**:
   - Export markdown files
   - Import into Sanity Studio
   - Map frontmatter to Sanity fields

5. **Update Environment Variables**:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

**Resources:**
- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Guide](https://www.sanity.io/docs/js-client)

### Option 2: Contentful

**Why Contentful?**
- Enterprise-grade platform
- Strong content modeling
- Excellent API
- Rich media management
- Free tier available

**Migration Steps:**

1. **Install Contentful**:
   ```bash
   npm install contentful
   ```

2. **Create Contentful Space**:
   - Sign up at [contentful.com](https://contentful.com)
   - Create a new space
   - Define content models for pages and posts

3. **Update Content Utilities** (`lib/content.ts`):
   ```typescript
   import { createClient } from 'contentful'

   const client = createClient({
     space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
     accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
   })

   export async function getContentItems(type: 'pages' | 'posts') {
     const response = await client.getEntries({
       content_type: type,
     })
     return response.items
   }
   ```

4. **Migrate Content**:
   - Use Contentful's import tool
   - Map markdown frontmatter to Contentful fields
   - Upload images to Contentful's media library

5. **Update Environment Variables**:
   ```env
   NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
   NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_access_token
   ```

**Resources:**
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Next.js + Contentful Guide](https://www.contentful.com/developers/docs/javascript/tutorials/getting-started-with-contentful-and-javascript/)

## Migration Checklist

When ready to migrate:

- [ ] Choose CMS (Sanity or Contentful)
- [ ] Set up CMS account and project/space
- [ ] Define content models matching current structure
- [ ] Export all markdown content
- [ ] Import content into CMS
- [ ] Update `lib/content.ts` to use CMS client
- [ ] Update components to handle CMS data structure
- [ ] Test all pages and posts
- [ ] Set up environment variables
- [ ] Deploy and verify
- [ ] Train content editors on new CMS

## Hybrid Approach

You can also use a hybrid approach:

- **Keep markdown for simple pages** (About, Legal, etc.)
- **Use CMS for dynamic content** (Blog posts, product descriptions, etc.)

This gives you the flexibility to use the best tool for each content type.

## Questions?

For questions about content management or migration, contact the development team.



