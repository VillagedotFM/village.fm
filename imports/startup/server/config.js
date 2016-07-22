import { SEO } from '../../api/seo/seo.js';

SEO.routes.upsert({routeName: 'Home'}, {$set: {
  title: 'Village.fm',
  description: 'Check out this song on Village.fm',
  meta: {
  	'property="og:url"': 'https://village.fm',
    'property="og:image"': 'https://village.fm/img/cover.jpg',
    'property="og:type"': 'website',
    'property="og:site_name"': 'Village.fm',
    'name="twitter:card"': 'summary',
  }
}});

SEO.routes.upsert({routeName: 'Post'}, {$set: {
  title: 'Village.fm',
  description: 'Check out this song on Village.fm',
  meta: {
  	'property="og:url"': 'https://village.fm',
    'property="og:image"': 'https://village.fm/img/cover.jpg',
    'property="og:type"': 'website',
    'property="og:site_name"': 'Village.fm',
    'name="twitter:card"': 'summary',
  }
}});

