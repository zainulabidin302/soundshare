'use strict';
app.service('ssShareService', function($http, apiURL) {
    function shareWithEmail(data) {
      return $http.post(apiURL + '/share/email', data);
    }
    return {
      shareWithEmail: shareWithEmail
    }
});
