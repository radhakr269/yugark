import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalPath?: string;
  ogImage?: string;
  noIndex?: boolean;
  articleData?: {
    headline: string;
    datePublished?: string;
    authorName?: string;
    image?: string;
  };
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  ogTitle,
  ogDescription,
  canonicalPath,
  ogImage = '/assets/images/hero.jpg',
  noIndex = false,
  articleData,
}) => {
  useEffect(() => {
    // 1. Document title
    document.title = `${title} | YUGARK DIGITAL STUDIO`;

    // Helper for meta tags
    const setMetaTag = (nameAttr: 'name' | 'property', key: string, value: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // 2. Standard Meta
    setMetaTag('name', 'description', description);

    // 3. Robots indexing control
    if (noIndex || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'))) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow');
    }

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:type', articleData ? 'article' : 'website');
    setMetaTag('property', 'og:title', ogTitle || title);
    setMetaTag('property', 'og:description', ogDescription || description);
    setMetaTag('property', 'og:image', `${window.location.origin}${ogImage}`);
    setMetaTag('property', 'og:site_name', 'Yugark Digital Studio');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', ogTitle || title);
    setMetaTag('name', 'twitter:description', ogDescription || description);
    setMetaTag('name', 'twitter:image', `${window.location.origin}${ogImage}`);

    // 6. Canonical link
    if (canonicalPath) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', `${window.location.origin}${canonicalPath}`);
    }

    // 7. Schema.org Structured Data (JSON-LD)
    let jsonLdScript = document.getElementById('json-ld-structured-data');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'json-ld-structured-data';
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }

    if (articleData) {
      jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: articleData.headline,
        description: description,
        image: articleData.image ? `${window.location.origin}${articleData.image}` : `${window.location.origin}/assets/images/hero.jpg`,
        datePublished: articleData.datePublished || '2026-10-09',
        author: {
          '@type': 'Organization',
          name: articleData.authorName || 'Yugark Editorial',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Yugark Digital Studio',
          url: 'https://yugark.in',
        },
      });
    } else {
      jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Yugark Digital Studio',
        url: 'https://yugark.in',
        email: 'business@yugark.in',
        description: 'Modern digital studio offering websites, creative content, and digital marketing solutions.',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Support',
          url: 'https://wa.me/919125272460',
        },
        sameAs: [
          'https://instagram.com',
          'https://linkedin.com',
          'https://youtube.com',
        ],
      });
    }
  }, [title, description, ogTitle, ogDescription, canonicalPath, ogImage, noIndex, articleData]);

  return null;
};
