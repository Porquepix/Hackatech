    /**
     * Login Controller. Available in login page.
     */
    app.controller('LoginCtrl', function($auth, $state, messageCenterService, authtification) {
        var ctrl = this;

        // Submit of the login form
        ctrl.login = function() {
            ctrl.dataLoading = true;

            var credentials = {
                email: ctrl.email,
                password: ctrl.password
            };

            var success = function(response) {
                authtification.saveLocalFresh(function() {
                    $state.go('indexAuth');
                });
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
                    if (response.data.error)
                        messageCenterService.add('danger', response.data.error, {});

                    if (typeof response.data === 'string' || response.data instanceof String)
                        messageCenterService.add('danger', response.data, {});
                }
                ctrl.dataLoading = false;
                ctrl.password = '';
            };

            authtification.login(credentials, success, error);
        }
    });