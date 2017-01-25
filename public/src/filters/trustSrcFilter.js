'use strict';
app.filter('ssTrustSSURL', function($sce, clientId) {
      return function(s) {
        return $sce.trustAsResourceUrl(s + '?allow_redirects=False&client_id=' + clientId);
      }
});
