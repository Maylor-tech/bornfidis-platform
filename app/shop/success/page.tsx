import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-bf-green rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline text-bf-green mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg md:text-xl font-body text-gray-700 mb-8">
            Thank you for your purchase. You will receive a confirmation email shortly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="btn btn-primary bg-bf-green text-white hover:bg-opacity-90 px-8 py-4"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="btn btn-outline border-2 border-bf-green text-bf-green hover:bg-bf-green hover:text-white px-8 py-4"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

