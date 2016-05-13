(function() {

    /**
     * Organization Controller. Available in organization pages.
     */
    app.controller('OrganizationUpdateCtrl', function($scope, $rootScope, $http, $state, $stateParams, messageCenterService, form) {
        var ctrl = this;

        // Organization which is currently updated
        ctrl.current = {};
        ctrl.dataLoading = false;

        ctrl.loadData();

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

    });

});
