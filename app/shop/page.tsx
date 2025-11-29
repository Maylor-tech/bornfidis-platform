import ProductCard from '@/components/ProductCard'
import { products } from '@/lib/products'

export default function Shop() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline text-bf-green mb-4">
          Explore Our Collections
        </h1>
        <p className="text-lg md:text-xl font-body text-gray-700 max-w-2xl mx-auto">
          Sustainable activewear designed for those who refuse to compromise between style, comfort, and environmental responsibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            image={product.image}
            imageAlt={product.imageAlt}
            href={`/shop/${product.id}`}
            sizeOptions={product.sizeOptions}
            isPreorder={product.isPreorder}
          />
        ))}
      </div>
    </div>
  )
}
