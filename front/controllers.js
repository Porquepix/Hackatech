(function() {

    var texts = {
        loginController: {
            invalidCredentials: "Wrong identifiers !",
            unknowError: "Unknow error !"
        },
    };

    app.controller('HomeController', function($http) {
        this.nbChallengers = 0;
        this.nbHackathons = 0;

            $http.get(api('/')).success(function(users) {
                console.log(users);
            }).error(function(error) {
                 console.log(error);
            });
    });


    app.controller('LoginController', function($auth, $location) {
        var ctrl = this;

        ctrl.login = function() {
            ctrl.dataLoading = true;

            var credentials = {
                email: ctrl.email,
                password: ctrl.password
            }

            $auth.login(credentials).then(function(response) {
                $location.path(route('index'));
            }, function(response) {
                if (response.status == 401) {
                    ctrl.errorMessage = texts.loginController.invalidCredentials;
                } else {
                    ctrl.errorMessage = texts.loginController.unknowError;
                }
                ctrl.dataLoading = false;
                ctrl.password = '';
            });
        }
    });

})();