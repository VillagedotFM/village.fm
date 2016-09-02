Package.describe({
  name: 'jorisderuiter:analytics',
  summary: '',
  version: '0.1.0'
});

Package.onUse(function(api) {
  api.use('templating', 'client');

  api.addFiles([
    'script.html',
    'analytics.js'
  ],['client']);

  api.export([
    'Analytics'
  ],['client']);
});
