import { SEO } from '../../api/seo/seo.js';

SEO.routes.upsert({routeName: 'Home'}, {$set: {
  title: 'Village.fm',
  description: 'Check out this song on Village.fm',
  meta: {
  	'property="og:url"': 'http://village.fm',
    'property="og:image"': 'http://village.fm/images/img-topbar-main@3x.png',
    'property="og:type"': 'website',
    'property="og:site_name"': 'Village.fm',
    'name="twitter:card"': 'summary',
  }
}});

SEO.routes.upsert({routeName: 'Village'}, {$set: {
  title: 'Village.fm',
  description: 'Check out this song on Village.fm',
  meta: {
  	'property="og:url"': 'http://village.fm',
    'property="og:image"': 'http://village.fm/images/img-topbar-main@3x.png',
    'property="og:type"': 'website',
    'property="og:site_name"': 'Village.fm',
    'name="twitter:card"': 'summary',
  }
}});

SEO.routes.upsert({routeName: 'Post'}, {$set: {
  title: 'Village.fm',
  description: 'Check out this song on Village.fm',
  meta: {
  	'property="og:url"': 'http://village.fm',
    'property="og:image"': 'http://village.fm/images/img-topbar-main@3x.png',
    'property="og:type"': 'website',
    'property="og:site_name"': 'Village.fm',
    'name="twitter:card"': 'summary',
  }
}});
