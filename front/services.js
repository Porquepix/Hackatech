/**
* Services
*/
(function() {

    /**
     * Service to get data about the logged user.
     */
    app.service('user', function($http, $rootScope) {
        var service = this;

        service.data = null;

        /**
         * Execute the callback function on the buffered data.
         * The data are passed in the callback function as argument.
         */
        service.getData = function(callback) {
            if (service.data == null) {
                service.getFreshData(callback);
            } else {
                callback(service.data);
            }
        };

        /**
         * Clear the buffered data.
         */
        service.clearData = function() {
            service.data = null;
        };

        /**
         * Execute the callback function on the fresh data.
         * Do an ajax call.
         * The data are passed in the callback function as argument.
         */
        service.getFreshData = function(callback, errorCallback) {
            service.temp = $http.get(api('auth_user')).then(function(response) {
                service.data = response.data.user;
                callback(service.data);
            }, function(response) {
                if (errorCallback) {
                    errorCallback(response);
                }
            });
        };

        /**
         * Save the buffered data about the user in local storage.
         */
        service.saveLocal = function() {
            service.getData(function(data) {

                var user = JSON.stringify(data);
                localStorage.setItem('user', user);

                $rootScope.authenticated = true;
                $rootScope.currentUser = data;
                
            });
        };

        /**
         * Save the fresh data about the user in local storage.
         */
        service.saveLocalFresh = function() {
            service.clearData();
            service.saveLocal();
        };
    });

})();