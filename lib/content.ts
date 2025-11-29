import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export interface ContentMetadata {
  title?: string
  description?: string
  date?: string
  author?: string
  slug: string
  [key: string]: any
}

export interface ContentItem {
  metadata: ContentMetadata
  content: string
}

// Get all content items from a directory
export function getContentItems(type: 'pages' | 'posts'): ContentItem[] {
  const directory = path.join(contentDirectory, type)
  
  if (!fs.existsSync(directory)) {
    return []
  }

  const fileNames = fs.readdirSync(directory)
  const allContentData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(directory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        metadata: {
          ...data,
          slug,
        },
        content,
      }
    })

  // Sort posts by date (newest first), pages alphabetically
  if (type === 'posts') {
    return allContentData.sort((a, b) => {
      const dateA = (a.metadata as ContentMetadata).date ? new Date((a.metadata as ContentMetadata).date!).getTime() : 0
      const dateB = (b.metadata as ContentMetadata).date ? new Date((b.metadata as ContentMetadata).date!).getTime() : 0
      return dateB - dateA
    }) as ContentItem[]
  }

  return allContentData.sort((a, b) => 
    ((a.metadata as ContentMetadata).title || (a.metadata as ContentMetadata).slug || '').localeCompare((b.metadata as ContentMetadata).title || (b.metadata as ContentMetadata).slug || '')
  ) as ContentItem[]
}

// Get a single content item by slug
export function getContentItem(
  type: 'pages' | 'posts',
  slug: string
): ContentItem | null {
  const directory = path.join(contentDirectory, type)
  const fullPath = path.join(directory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    metadata: {
      ...data,
      slug,
    },
    content,
  }
}

// Get all slugs for a content type
export function getContentSlugs(type: 'pages' | 'posts'): string[] {
  const directory = path.join(contentDirectory, type)
  
  if (!fs.existsSync(directory)) {
    return []
  }

  const fileNames = fs.readdirSync(directory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
}

// Get posts with pagination
export function getPosts(limit?: number, offset = 0): ContentItem[] {
  const posts = getContentItems('posts')
  
  if (limit) {
    return posts.slice(offset, offset + limit)
  }
  
  return posts.slice(offset)
}

