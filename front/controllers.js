(function() {

    var texts = {
        appController: {
            logout: 'You have successfully logout !'
        },
    };

    /**
     * Main Controller. Available in every page.
     */
    app.controller('AppController', function($state, $auth, $rootScope, messageCenterService) {
        this.logout = function() {
            $auth.logout().then(function() {
                // Remove the authenticated user from local storage
                localStorage.removeItem('user');

                // Flip authenticated to false so that we no longer
                // show UI elements dependant on the user being logged in
                $rootScope.authenticated = false;

                // Remove the current user info from rootscope
                $rootScope.currentUser = null;


                messageCenterService.add('success', texts.appController.logout, { status: messageCenterService.status.next });

                $state.go('index');
            });
        }
    });

    /**
     * Home Controller. Available in home page.
     */
    app.controller('HomeController', function($http) {
        var ctrl = this;

        // Get some stats to display on the home page
        $http.get(api('index'), {}).then(function(response) {
            ctrl.nbChallengers = response.data.nbChallengers;
        });

        this.nbHackathons = 0;
    });

    /**
     * Login Controller. Available in login page.
     */
    app.controller('LoginController', function($auth, $state, $http, $rootScope, messageCenterService, user) {
        var ctrl = this;

        // Submit of the login form
        ctrl.login = function() {
            ctrl.dataLoading = true;

            var credentials = {
                email: ctrl.email,
                password: ctrl.password
            };

            $auth.login(credentials).then(function(response) {
                user.saveLocalFresh();
                $state.go('indexAuth');
            // Handle errors
            }, function(response) {
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
            });
        }
    });

    /**
     * Register Controller. Available in register page.
     */
    app.controller('RegisterController', function($http, $state, messageCenterService) {
        var ctrl = this;

        // Submit of the register form
        ctrl.register = function() {
            ctrl.dataLoading = true;

            var data = {
                name: ctrl.name,
                email: ctrl.email,
                password: ctrl.password
            };

            $http.post(api('register'), data).then(function(response) {
                messageCenterService.add('success', response.data.message, { status: messageCenterService.status.next });
                $state.go('login');
            // Handle errors
            }, function(response) {
                messageCenterService.reset();

                if (response.data.name)
                    messageCenterService.add('danger', response.data.name[0], {});

                if (response.data.email)
                    messageCenterService.add('danger', response.data.email[0], {});

                if (response.data.password)
                    messageCenterService.add('danger', response.data.password[0], {});

                ctrl.dataLoading = false;
                ctrl.password = '';
                ctrl.password2 = '';
            });
        };
    });

    /**
     * Password Controller. Available in password reset pages.
     */
    app.controller('PasswordController', function($location, $scope, $http, messageCenterService) {
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

            $http.post(api('password_email'), data).then(function(response) {
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

            $http.put(api('password_reset'), data).then(function(response) {
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

    /**
     * User Controller. Available in user pages.
     */
    app.controller('UserController', function($rootScope, $http, $state, messageCenterService, user) {
        var ctrl = this;

        // Initialize the data about the user in profile pages
        ctrl.init = function() {
            user.getFreshData(function(data) {
                ctrl.profile = data;
                ctrl.profile.created_at = new Date(ctrl.profile.created_at);
            });
        };
        ctrl.init();

        // Submit of the update profil form
        ctrl.update = function() {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {};
            if (ctrl.profile.email != $rootScope.currentUser.email)
                data.email = ctrl.profile.email;
            if (ctrl.profile.password)
                data.password = ctrl.profile.password;

            $http.put(api('profil_edit').format([$rootScope.currentUser.id]), data).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                user.saveLocalFresh();
                
                ctrl.password = '';
                ctrl.password2 = '';
                ctrl.dataLoading = false;
            // Handle errors               
            }, function(response) {
                if (response.data.email)
                    messageCenterService.add('danger', response.data.email[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                ctrl.password = '';
                ctrl.password2 = '';
                ctrl.dataLoading = false;
            });
        };
    });

    /**
     * Organization Controller. Available in organization pages.
     */
    app.controller('OrganizationController', function($scope, $rootScope, $http, $state, $stateParams, messageCenterService) {
        var ctrl = this;
        // All organisations of the user
        ctrl.orga = {};
        // Organization which is currently updated
        ctrl.current = {};

        // Get the organizations of the user
        ctrl.init = function() {
            $http.get(api('user_organizations').format([$rootScope.currentUser.id]), {}).then(function(response) {
                ctrl.orga.admin = response.data.admin;
                ctrl.orga.member = response.data.member;
            });
        };
        ctrl.init();

        // Load the data for a form (edit)
        ctrl.loadFormData = function() {
            if ($stateParams.organizationId != null) {
                $http.get(api('organizations_view').format([$stateParams.organizationId]), {}).then(function(response) {
                    if (response.data.admin_id == $rootScope.currentUser.id)
                        ctrl.current = response.data;
                    else
                        $state.go('my_organizations');
                });
            }
        };

        // Save data when the organization is created or edited
        ctrl.save = function(orgaId) {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {};
            if ($scope.form.name.$dirty) 
                data.name = ctrl.current.name;
            if ($scope.form.email.$dirty) 
                data.email = ctrl.current.email;
            if ($scope.form.facebook.$dirty) 
                data.facebook = ctrl.current.facebook;
            if ($scope.form.twitter.$dirty) 
                data.twitter = ctrl.current.twitter;

            var succesCallback = function(response) {
                messageCenterService.add('success', response.data.message, {});
                ctrl.init();
                ctrl.dataLoading = false;
            };
            var errorCallback = function(response) {
                if (response.data.name)
                    messageCenterService.add('danger', response.data.name[0], {});

                if (response.data.email)
                    messageCenterService.add('danger', response.data.email[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                ctrl.dataLoading = false;
            };

            // If null => create case, else edit case
            if ($stateParams.organizationId != null) {
                $http.put(api('organizations_edit').format([orgaId]), data).then(succesCallback, errorCallback);
            } else {
                $http.post(api('organizations_create'), data).then(succesCallback, errorCallback);
            }
        };

        // Delete the organization
        ctrl.delete = function(orgaId) {
            messageCenterService.reset();
            $http.delete(api('organizations_delete').format([orgaId]), {}).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                ctrl.init();
            });
        };

    });

})();