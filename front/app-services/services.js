/**
* Authentication Service
*/
(function() {

    app.service('AuthService', function($http) {
        this.login = function(email, password, callback) {
            $http.post(api('/login'), { email: email, password: password }).then(
                function(response) {
                    callback(response);
                }
            );
        };
    });

})();