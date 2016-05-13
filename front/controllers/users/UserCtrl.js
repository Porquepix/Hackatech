(function() {

    /**
     * User Controller. Available in user pages.
     */
    app.controller('UserController', function($scope, $rootScope, $http, messageCenterService, user, form) {
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

});