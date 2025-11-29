import Link from 'next/link'
import { getContentItems } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'

export default async function PostsPage() {
  const posts = getContentItems('posts')

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-headline text-bf-green mb-8">
          Blog Posts
        </h1>

        {posts.length === 0 ? (
          <p className="text-lg font-body text-gray-700">
            No posts available yet. Check back soon!
          </p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.metadata.slug}
                className="bg-white rounded-lg shadow-md p-6 md:p-8 hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  {post.metadata.date && (
                    <time
                      dateTime={post.metadata.date}
                      className="text-sm font-body text-gray-500"
                    >
                      {new Date(post.metadata.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                  {post.metadata.author && (
                    <span className="text-sm font-body text-gray-500 ml-2">
                      by {post.metadata.author}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-headline text-bf-green mb-3">
                  <Link
                    href={`/posts/${post.metadata.slug}`}
                    className="hover:text-bf-gold transition-colors"
                  >
                    {post.metadata.title}
                  </Link>
                </h2>

                {post.metadata.description && (
                  <p className="text-base font-body text-gray-700 mb-4">
                    {post.metadata.description}
                  </p>
                )}

                <Link
                  href={`/posts/${post.metadata.slug}`}
                  className="inline-flex items-center text-bf-green font-body font-semibold hover:text-bf-gold transition-colors"
                >
                  Read more
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



