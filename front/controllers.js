(function() {

    var texts = {
        appController: {
            logout: 'You have successfully logout !'
        },
        loginController: {
            invalidCredentials: 'Wrong identifiers !',
            unknowError: 'Unknow error !'
        },
    };

    app.controller('AppController', function($auth, $rootScope, messageCenterService) {
        this.logout = function() {
            $auth.logout().then(function() {
                // Remove the authenticated user from local storage
                localStorage.removeItem('user');

                // Flip authenticated to false so that we no longer
                // show UI elements dependant on the user being logged in
                $rootScope.authenticated = false;

                // Remove the current user info from rootscope
                $rootScope.currentUser = null;


                messageCenterService.add('success', texts.appController.logout, { timeout: 3000 });
            });
        }
    });

    app.controller('HomeController', function($http) {
        this.nbChallengers = 0;
        this.nbHackathons = 0;
    });


    app.controller('LoginController', function($auth, $state, $http, $rootScope) {
        var ctrl = this;

        ctrl.login = function() {
            ctrl.dataLoading = true;

            var credentials = {
                email: ctrl.email,
                password: ctrl.password
            };

            $auth.login(credentials).then(function(response) {
                // Return an $http request for the now authenticated
                return $http.get(api('auth_user'));
            // Handle errors
            }, function(response) {
                if (response.status == 401) {
                    ctrl.errorMessage = texts.loginController.invalidCredentials;
                } else {
                    ctrl.errorMessage = texts.loginController.unknowError;
                }
                ctrl.dataLoading = false;
                ctrl.password = '';
            }).then(function(response) {
                var user = JSON.stringify(response.data.user);
                localStorage.setItem('user', user);

                $rootScope.authenticated = true;
                $rootScope.currentUser = response.data.user;

                $state.go('index');
            });
        }
    });

    app.controller('RegisterController', function() {
        var ctrl = this;

        ctrl.register = function($http, $state) {
            var data = {
                name: ctrl.name,
                email: ctrl.email,
                password: ctrl.password
            };

            $http.post(api('register'), data).then(function(response) {

            }, function(response) {

            });
        };
    });

})();