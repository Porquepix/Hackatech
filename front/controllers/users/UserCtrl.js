    /**
     * User Controller. Available in user pages.
     */
    app.controller('UserCtrl', function($scope, $rootScope, $http, messageCenterService, authtification, form) {
        var ctrl = this;

        // Initialize the data about the user in profile pages
        ctrl.init = function() {
            authtification.getFreshData(function(data) {
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
                authtification.saveLocalFresh();
                
                ctrl.password = '';
                ctrl.password2 = '';
                ctrl.dataLoading = false;
            // Handle errors               
            }, function(response) {
                if (response.data.email)
                    messageCenterService.add('danger', response.data.email[0], {});

                if (typeof response.data === 'string' || response.data instanceof String)
                    messageCenterService.add('danger', response.data, {});

                ctrl.password = '';
                ctrl.password2 = '';
                ctrl.dataLoading = false;
            });
        };
    });