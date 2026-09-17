import { Helmet } from 'react-helmet-async'
import { siteConfig } from '../../config/siteConfig'

export default function SEO({ title, description = siteConfig.description }) {
  const pageTitle = title || `${siteConfig.name} | Emballages alimentaires & Bouteilles de jus`
  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}

