import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { siteConfig } from '../../config/siteConfig'

const BASE_DOMAIN = 'https://www.maurellefoodpack.store'

export default function SEO({
  title,
  description = siteConfig.description,
  image = `${BASE_DOMAIN}/og-image.png`,
  type = 'website',
  productData = null,
  breadcrumbs = null,
  schema = null,
}) {
  const location = useLocation()
  const pageTitle = title || `${siteConfig.name} | Emballages alimentaires & Bouteilles de jus au Bénin`
  const canonicalUrl = `${BASE_DOMAIN}${location?.pathname === '/' ? '' : location?.pathname || ''}`
  const imageUrl = image.startsWith('http') ? image : `${BASE_DOMAIN}${image.startsWith('/') ? '' : '/'}${image}`

  // Default Organization & LocalBusiness JSON-LD Schema
  const defaultOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'WholesaleStore'],
    name: 'FOOD PACK Bénin',
    alternateName: 'Maurelle Food Pack',
    url: BASE_DOMAIN,
    logo: `${BASE_DOMAIN}/app-icon-512.png`,
    image: `${BASE_DOMAIN}/og-image.png`,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cotonou & Parakou',
      addressCountry: 'BJ',
      streetAddress: 'Cotonou, Bénin',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 6.3654,
      longitude: 2.4183,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '19:00',
      },
    ],
    priceRange: 'FCFA',
    currenciesAccepted: 'XOF',
    paymentAccepted: 'Cash, Mobile Money (MTN, Moov, Celtiis), Wave',
  }

  // Product specific schema
  const productSchema = productData
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productData.name,
        image: Array.isArray(productData.images) && productData.images.length > 0 ? productData.images : [imageUrl],
        description: productData.shortDescription || productData.description || description,
        brand: {
          '@type': 'Brand',
          name: 'FOOD PACK',
        },
        offers: {
          '@type': 'Offer',
          url: canonicalUrl,
          priceCurrency: 'XOF',
          price: productData.price || 0,
          availability:
            productData.stockStatus === 'Rupture'
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'FOOD PACK Bénin',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: productData.rating || 4.9,
          reviewCount: productData.ratingCount || 28,
        },
      }
    : null

  // Breadcrumbs schema
  const breadcrumbsSchema =
    breadcrumbs && Array.isArray(breadcrumbs)
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: item.url?.startsWith('http') ? item.url : `${BASE_DOMAIN}${item.url}`,
          })),
        }
      : null

  const activeSchema = schema || productSchema || defaultOrganizationSchema

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="FOOD PACK" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Geo Tags */}
      <meta name="geo.region" content="BJ-LI" />
      <meta name="geo.placename" content="Cotonou, Parakou, Bénin" />
      <meta name="geo.position" content="6.3654;2.4183" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">{JSON.stringify(activeSchema)}</script>
      {breadcrumbsSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbsSchema)}</script>}
    </Helmet>
  )
}
