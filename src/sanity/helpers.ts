// src/lib/sanityHelpers.ts
import { client } from './client'; // tu client
import { createImageUrlBuilder } from '@sanity/image-url';

// Builder para imágenes optimizadas
const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source).auto('format').fit('max');
}

// Query para todos los productos (para catálogo)
export const allProductsQuery = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  title,
  price,
  salePrice,
  isOnSale,
  isFeatured,
  stock,
  isAvailable,
  "slug": slug.current,
  "mainImage": images[0],
  categories[]-> { title, slug },
  occasions,
  tags
}`;

// Query para pocos datos de productos
export const exampleQuery = `*[_type == "product" && defined(slug.current)]
  | order(publishedAt desc)[0...12] {
  _id, title, 
  slug, 
  publishedAt
}`

// Query para producto por slug (detalle)
export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  price,
  salePrice,
  isOnSale,
  description,
  images[] {
    asset->,
    alt,
    isMain
  },
  "mainImage": images[0],
  categories[]-> { title, slug },
  occasions,
  stock,
  isAvailable,
  tags,
  seoDescription
}`;