import { SEO } from '../../api/seo/seo.js';

SEO.routes.upsert({routeName: 'Home'}, {$set: {
  title: 'Village.fm',
  description: 'Democratic playlists, built and voted on by groups of music lovers.',
  meta: {
  	'property="og:url"': 'http://village.fm',
    'property="og:image"': 'http://village.fm/images/FBCoverphoto.png',
    'property="og:image:width"': '851',
    'property="og:image:height"': '315',
    'property="og:type"': 'website',
    'property="og:site_name"': 'Village.fm',
    'name="twitter:card"': 'summary',
  }
}});

SEO.routes.upsert({routeName: 'All'}, {$set: {
  title: 'Village.fm',
  description: 'Democratic playlists, built and voted on by groups of music lovers.',
  meta: {
  	'property="og:url"': 'http://village.fm',
    'property="og:image"': 'http://village.fm/images/FBCoverphoto.png',
    'property="og:image:width"': '851',
    'property="og:image:height"': '315',
    'property="og:type"': 'website',
    'property="og:site_name"': 'Village.fm',
    'name="twitter:card"': 'summary',
  }
}});

SEO.routes.upsert({routeName: 'Village'}, {$set: {
  title: 'Village.fm',
  description: 'Check out this Village',
  meta: {
  	'property="og:url"': 'http://village.fm',
    'property="og:image"': 'http://village.fm/images/FBCoverphoto.png',
    'property="og:image:width"': '851',
    'property="og:image:height"': '315',
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
    'property="og:image"': 'http://village.fm/images/FBCoverphoto.png',
    'property="og:type"': 'website',
    'property="og:image:width"': '475',
    'property="og:image:height"': '250',
    'property="og:site_name"': 'Village.fm',
    'name="twitter:card"': 'summary',
  }
}});
