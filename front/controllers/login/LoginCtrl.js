(function() {

    /**
     * Login Controller. Available in login page.
     */
    app.controller('LoginCtrl', function($auth, $state, messageCenterService, Auth) {
        var ctrl = this;

        // Submit of the login form
        ctrl.login = function() {
            ctrl.dataLoading = true;

            var credentials = {
                email: ctrl.email,
                password: ctrl.password
            };

            var success = function(response) {
                Auth.saveLocalFresh();
                $state.go('indexAuth');
            };
            var error = function(response) {
                messageCenterService.reset();

                if (response.status == 401) {
                    messageCenterService.add('danger', response.data.error, {});
                } else if (response.status == 422) {
                    if (response.data.email)
                        messageCenterService.add('danger', response.data.email[0], {});

                    if (response.data.password)
                        messageCenterService.add('danger', response.data.password[0], {});

                } else {
                    messageCenterService.add('danger', response.data.error, {});
                }
                ctrl.dataLoading = false;
                ctrl.password = '';
            };

            Auth.login(credentials, success, error);
        }
    });

});