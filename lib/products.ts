export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  imageAlt: string
  sizeOptions?: Array<{
    value: string
    label: string
    available?: boolean
  }>
  isPreorder?: boolean
  stripePriceId?: string
}

export const products: Product[] = [
  {
    id: 'hoodie',
    name: 'Hoodie',
    description: 'Premium quality hoodie featuring our signature mountain design. Made with sustainable materials and designed for comfort in any season.',
    price: 89.99,
    image: '/images/products/middle-mountain-hoodie.svg',
    imageAlt: 'Hoodie',
    sizeOptions: [
      { value: 's', label: 'S', available: true },
      { value: 'm', label: 'M', available: true },
      { value: 'l', label: 'L', available: true },
      { value: 'xl', label: 'XL', available: true },
      { value: 'xxl', label: 'XXL', available: false },
    ],
    isPreorder: true,
    stripePriceId: 'price_1SYBmNRV4jor9T5UloEeu1o5',
  },
  {
    id: 'beanie',
    name: 'Beanie',
    description: 'Warm and stylish beanie featuring the Bornfidis logo. Perfect for cold weather adventures and everyday wear.',
    price: 34.99,
    image: '/images/products/bornfidis-beanie.svg',
    imageAlt: 'Beanie',
    sizeOptions: [
      { value: 'one-size', label: 'One Size', available: true },
    ],
    isPreorder: false,
    stripePriceId: 'price_1SYBvWRV4jor9T5UnasawPLX',
  },
  {
    id: 'kit',
    name: 'Kit',
    description: 'Complete digital collection of recipes, meal planning guides, and cooking tips from our professional chefs. Perfect for home cooks looking to elevate their skills.',
    price: 49.99,
    image: '/images/products/chef-digital-starter-kit.svg',
    imageAlt: 'Kit',
    isPreorder: false,
    stripePriceId: 'price_1SYBydRV4jor9T5UGv2DeqaP',
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

