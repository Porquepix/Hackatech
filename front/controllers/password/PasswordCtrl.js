(function() {

    /**
     * Password Controller. Available in password reset pages.
     */
    app.controller('PasswordCtrl', function($location, $http, messageCenterService, Auth) {
        var ctrl = this;

        // If we are in step of 2 (reset password)
        // we take data in the url
        ctrl.email = $location.search().email;
        ctrl.token = $location.search().token;

        // Send an email to reset password
        ctrl.sendEmail = function() {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {
                email: ctrl.email,
                link: 'http://hackatech.alexis-andrieu.fr/#/password/reset'
            };

            Auth.sendResetPasswd(data, function(response) {
                messageCenterService.add('success', response.data.message, {});

                ctrl.dataLoading = false;
            // Handle errors                
            }, function(response) {
                if (response.data.email)
                    messageCenterService.add('danger', response.data.email[0], {});

                ctrl.dataLoading = false;
            });
        };

        // Reset the password
        ctrl.reset = function() {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {
                email: ctrl.email,
                password: ctrl.password,
                token: ctrl.token
            };

            Auth.resetPasswd(data, function(response) {
                messageCenterService.add('success', response.data.message, {});

                ctrl.dataLoading = false;
            // Handle errors                
            }, function(response) {
                if (response.data.email)
                    messageCenterService.add('danger', response.data.email[0], {});

                if (response.data.token)
                    messageCenterService.add('danger', response.data.token[0], {});

                if (response.data.password)
                    messageCenterService.add('danger', response.data.password[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                ctrl.password = '';
                ctrl.password2 = '';
                ctrl.dataLoading = false;
            });
        };

    });

});