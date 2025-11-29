import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getContentItem, getContentSlugs } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'

export async function generateStaticParams() {
  const slugs = getContentSlugs('posts')
  return slugs.map((slug) => ({ slug }))
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getContentItem('posts', slug)

  if (!post) {
    notFound()
  }

  const htmlContent = await markdownToHtml(post.content)

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/posts"
          className="inline-flex items-center text-bf-green font-body mb-6 hover:text-bf-gold transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back to Posts
        </Link>

        <article>
          <header className="mb-8">
            {post.metadata.date && (
              <time
                dateTime={post.metadata.date}
                className="text-sm font-body text-gray-500 block mb-2"
              >
                {new Date(post.metadata.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {post.metadata.author && (
              <p className="text-sm font-body text-gray-500 mb-4">
                by {post.metadata.author}
              </p>
            )}
            <h1 className="text-4xl md:text-5xl font-headline text-bf-green mb-4">
              {post.metadata.title}
            </h1>
            {post.metadata.description && (
              <p className="text-xl font-body text-gray-700">
                {post.metadata.description}
              </p>
            )}
          </header>

          <div
            className="prose prose-lg max-w-none font-body text-gray-800"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </div>
    </div>
  )
}



