import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-headline text-bf-green mb-4">404</h1>
        <h2 className="text-3xl font-headline text-bf-green mb-4">Product Not Found</h2>
        <p className="text-lg font-body text-gray-700 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/shop"
          className="inline-block btn btn-primary bg-bf-green text-white hover:bg-opacity-90 px-8 py-4 text-lg rounded-lg"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  )
}

