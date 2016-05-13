    /**
     * Organization Controller. Available in organization pages.
     */
    app.controller('OrganizationUpdateCtrl', function($scope, $rootScope, $http, $state, $stateParams, messageCenterService, form) {
        var ctrl = this;

        // Organization which is currently updated
        ctrl.current = {};
        ctrl.dataLoading = false;

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
        ctrl.loadData();

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

    });
