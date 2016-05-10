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
            ctrl.nbHackathons = response.data.nbHackathons;
        });
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
    app.controller('UserController', function($scope, $rootScope, $http, $state, messageCenterService, user, form) {
        var ctrl = this;

        // Initialize the data about the user in profile pages
        ctrl.init = function() {
            user.getFreshData(function(data) {
                ctrl.profile = data;

                ctrl.profile.created_at = ctrl.profile.created_at.replace(/(.+) (.+)/, "$1T$2Z");
                ctrl.profile.created_at = new Date(ctrl.profile.created_at);
            });
        };
        ctrl.init();

        // Submit of the update profil form
        ctrl.update = function() {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {};
            form.populate($scope.form, data);

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
    app.controller('OrganizationController', function($scope, $rootScope, $http, $state, $stateParams, messageCenterService, form) {
        var ctrl = this;
        // All organisations of the user
        ctrl.orga = {};
        // Organization which is currently updated
        ctrl.current = {};
        ctrl.dataLoading = false;

        // Get the organizations of the user
        ctrl.init = function() {
            $http.get(api('user_organizations').format([$rootScope.currentUser.id]), {}).then(function(response) {
                ctrl.orga = response.data.admin;
                ctrl.orga.forEach(function(e) {
                    e.isAdmin = true;
                });
                ctrl.orga = ctrl.orga.concat(response.data.member);
            });
        };

        // Load the data for a form (edit / members edit)
        ctrl.loadData = function() {
            if ($stateParams.organizationId != null) {
                $http.get(api('organizations_view').format([$stateParams.organizationId]), {}).then(function(response) {
                    if (response.data.admin_id == $rootScope.currentUser.id)
                        ctrl.current = response.data;
                    else
                        $state.go('my_organizations');
                }, function(response) {
                    $state.go('my_organizations');
                });
            }
        };

        // Save data when the organization is created or edited
        ctrl.save = function(orgaId) {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {};
            form.populate($scope.form, data);

            var succesCallback = function(response) {
                messageCenterService.add('success', response.data.message, {});
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
        ctrl.delete = function(orga) {
            messageCenterService.reset();
            $http.delete(api('organizations_delete').format([orga.id]), {}).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                var index = ctrl.orga.indexOf(orga);
                ctrl.orga.splice(index, 1);
            });
        };

        // Add a user to an organization
        ctrl.add = function(orgaId) {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {
                name: ctrl.member.title
            };

            $http.post(api('organizations_add_user').format([orgaId]), data).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                ctrl.dataLoading = false;
                $scope.$broadcast('angucomplete-alt:clearInput');
                ctrl.loadData();
            }, function(response) {
                if (response.data.name)
                    messageCenterService.add('danger', response.data.name[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                ctrl.dataLoading = false;
            });
        };

        // Remove a user from an organization
        ctrl.remove = function(orgaId, member) {
            messageCenterService.reset();
            $http.delete(api('organizations_remove_user').format([orgaId, member.id]), {}).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                var index = ctrl.current.members.indexOf(member);
                ctrl.current.members.splice(index, 1);
            });
        };

        // Quit an organization
        ctrl.quit = function(orga) {
            messageCenterService.reset();
            $http.delete(api('organizations_remove_user').format([orga.id, $rootScope.currentUser.id]), {}).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                var index = ctrl.orga.indexOf(orga);
                ctrl.orga.splice(index, 1);
            });
        };

    });


    /**
     * Hackathon Controller. Available in hackathon pages.
     */
    app.controller('HackathonController', function($scope, $rootScope, $http, $state, messageCenterService, form, $stateParams) {
        var ctrl = this;
        // All hackathons
        ctrl.hackathons = [];
        // Hackathon which is currently loaded
        ctrl.current = {};
        // Participants which are currently loaded
        ctrl.participants = {};

        // Initialize the data about the hackathons
        ctrl.init = function() {
            page = $stateParams.page;
            $http.get(api('hackathons') + '?page=' + page, {}).then(function(response) {
                ctrl.hackathons = response.data;
                ctrl.hackathons.data.forEach(function(e) {
                    e.beginning_std = e.beginning.replace(/(.+) (.+)/, "$1T$2Z");
                    e.beginning_std = new Date(e.beginning_std);
                    e.beginning_std.setHours(e.beginning_std.getHours() - 1);

                    e.two = e.name;
                    e.two = e.two.charAt(0).toUpperCase() + e.two.charAt(1).toLowerCase();

                    ctrl.getColor(e);
                });
            });
        };

        ctrl.getColor = function(hackathon) {
            var classes = ['rgba-blue-strong', 'rgba-red-strong', 'rgba-pink-strong', 'rgba-purple-strong', 'rgba-indigo-strong', 'rgba-cyan-strong', 'rgba-green-strong', 'rgba-orange-strong'];
            var random = (hackathon.name.charCodeAt(0) + hackathon.name.charCodeAt(1) + hackathon.max_participant + hackathon.abstract.charCodeAt(0)) % classes.length;
            hackathon.color = classes[random];
        };

        // Load data about one hackathon which the id is in the url
        ctrl.loadData = function(callback) {
            if ($stateParams.hackathonId != null) {
                $http.get(api('hackathons_view').format([$stateParams.hackathonId]), {}).then(function(response) {
                    ctrl.current = response.data;

                    ctrl.current.data.beginning_std = ctrl.current.data.beginning.replace(/(.+) (.+)/, "$1T$2Z");
                    ctrl.current.data.beginning_std = new Date(ctrl.current.data.beginning_std);
                    ctrl.current.data.beginning_std.setHours(ctrl.current.data.beginning_std.getHours() - 1);

                    ctrl.current.data.ending_std = ctrl.current.data.ending.replace(/(.+) (.+)/, "$1T$2Z");
                    ctrl.current.data.ending_std = new Date(ctrl.current.data.ending_std);
                    ctrl.current.data.ending_std.setHours(ctrl.current.data.ending_std.getHours() - 1);

                    ctrl.getColor(ctrl.current.data);

                    if (callback)
                        callback();
                }, function(response) {
                    $state.go('hackathons');
                });
            }
        };

        ctrl.loadFormData = function() {
            if (!$rootScope.currentUser) {
                $state.go('login');
            }

            if ($stateParams.hackathonId != null) {
                ctrl.id = $stateParams.hackathonId;
                ctrl.loadData(function() {
                    if (!ctrl.current.isAdmin) {
                        $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
                    }

                    ctrl.current.data.orga = parseInt(ctrl.current.data.organization_id);
                });
            }


            $http.get(api('user_organizations').format([$rootScope.currentUser.id]), {}).then(function(response) {
                ctrl.orgas = response.data.admin;
            });
        };

        ctrl.loadParticipants = function() {
            ctrl.id = $stateParams.hackathonId;
            $http.get(api('hackathons_get_users').format([$stateParams.hackathonId]), {}).then(function(response) {
                ctrl.participants = response.data;
            }, function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            });
        };

        ctrl.register = function(userID) {
            messageCenterService.reset();

            var data = {};
            if (userID) {
                data.user_id = userID;
            } else {
                if ($rootScope.currentUser)
                    data.user_id = $rootScope.currentUser.id;
            }

            $http.post(api('hackathons_add_user').format([$stateParams.hackathonId]), data).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                ctrl.current.nbParticipants += 1;
                ctrl.current.isRegistered = true;

                if (userID) {
                    ctrl.loadParticipants();
                }
            }, function(response) {
                if (response.data.user_id)
                    messageCenterService.add('danger', response.data.user_id[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});
            });
        };

        ctrl.cancelRegistration = function(participant) {
            messageCenterService.reset();

            if (participant) {
                user_id = participant.id;
            } else {
                user_id = $rootScope.currentUser.id;
            }

            $http.delete(api('hackathons_remove_user').format([$stateParams.hackathonId, user_id]), {}).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                ctrl.current.nbParticipants -= 1;
                ctrl.current.isRegistered = false;

                if (participant) {
                    var index = ctrl.participants.indexOf(participant);
                    ctrl.participants.splice(index, 1);
                }
            }, function(response) {
                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});
            });
        };

        ctrl.attending = function(participant, status) {
            messageCenterService.reset();

            var data = {
                attending: status
            };

            $http.put(api('hackathons_update_user').format([$stateParams.hackathonId, participant.id]), data).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                participant.pivot.attending = status;
            }, function(response) {
                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});
            });
        };

        ctrl.save = function(hackathonID) {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {};
            form.populate($scope.form, data);

            var succesCallback = function(response) {
                messageCenterService.add('success', response.data.message, {});
                ctrl.dataLoading = false;
                $("body").scrollTop(0);
            };
            var errorCallback = function(response) {
                if (response.data.name)
                    messageCenterService.add('danger', response.data.name[0], {});

                if (response.data.abstract)
                    messageCenterService.add('danger', response.data.abstract[0], {});

                if (response.data.description)
                    messageCenterService.add('danger', response.data.description[0], {});

                if (response.data.max_participant)
                    messageCenterService.add('danger', response.data.max_participant[0], {});

                if (response.data.max_participant_per_team)
                    messageCenterService.add('danger', response.data.max_participant_per_team[0], {});

                if (response.data.place_adr)
                    messageCenterService.add('danger', response.data.place_adr[0], {});

                if (response.data.beginning)
                    messageCenterService.add('danger', response.data.beginning[0], {});

                if (response.data.ending)
                    messageCenterService.add('danger', response.data.ending[0], {});

                if (response.data.organization_id)
                    messageCenterService.add('danger', response.data.organization_id[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                ctrl.dataLoading = false;
                $("body").scrollTop(0);
            };

            // If null => create case, else edit case
            if ($stateParams.hackathonId != null) {
                $http.put(api('hackathons_edit').format([hackathonID]), data).then(succesCallback, errorCallback);
            } else {
                $http.post(api('hackathons_create'), data).then(succesCallback, errorCallback);
            }
        };

        // Delete the hackathon
        ctrl.delete = function() {
            messageCenterService.reset();
            $http.delete(api('hackathons_delete').format([$stateParams.hackathonId]), {}).then(function(response) {
                messageCenterService.add('success', response.data.message, { status: messageCenterService.status.next });
                $state.go('hackathons');
            });
        };




    });

})();