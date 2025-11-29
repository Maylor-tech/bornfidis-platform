import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getProductById } from '@/lib/products'
import ProductDetailClient from '@/components/ProductDetailClient'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.isPreorder && (
              <div className="absolute top-4 right-4 bg-bf-gold text-bf-black px-4 py-2 rounded-full text-sm font-body font-bold uppercase tracking-wide">
                Preorder
              </div>
            )}
          </div>

          {/* Product Details */}
          <ProductDetailClient product={product} />
        </div>
      </div>
    </div>
  )
}
