    /**
     * Organization Controller. Available in organization pages.
     */
    app.controller('OrganizationUpdateCtrl', function($scope, $rootScope, $http, $state, $stateParams, messageCenterService, form, Organization, OrganizationMember) {
        var ctrl = this;

        // Organization which is currently updated
        ctrl.current = {};
        ctrl.dataLoading = false;

        // Load the data for a form (edit / members edit)
        ctrl.loadData = function() {
            if ($stateParams.organizationId != null) {

                var success = function(response) {
                    if (response.admin_id != $rootScope.currentUser.id)
                        $state.go('my_organizations');
                };
                var error = function (response) {
                    $state.go('my_organizations');
                };

                ctrl.current = Organization.get({oid: $stateParams.organizationId}, success, error);
            }
        };
        ctrl.loadData();

        // Save data when the organization is created or edited
        ctrl.save = function(orga) {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {};
            form.populate($scope.form, data);

            var success = function(response) {
                messageCenterService.add('success', response.message, { status: messageCenterService.status.next });
                $state.go('my_organizations');
            };
            var error = function(response) {
                if (response.data.name)
                    messageCenterService.add('danger', response.data.name[0], {});

                if (response.data.email)
                    messageCenterService.add('danger', response.data.email[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                if (typeof response.data === 'string' || response.data instanceof String)
                    messageCenterService.add('danger', response.data, {});

                ctrl.dataLoading = false;
            };

            // If null => create case, else edit case
            if ($stateParams.organizationId != null) {
                data._oid = $stateParams.organizationId;
                Organization.update(data, success, error);
            } else {
                Organization.save(data, success, error);
            }
        };

        // Add a user to an organization
        ctrl.add = function(orga) {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {
                _oid: orga.id,
                name: ctrl.member.title
            };

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                $scope.$broadcast('angucomplete-alt:clearInput');
                ctrl.loadData();
                ctrl.dataLoading = false;
            };
            var error = function(response) {
                if (response.data.name)
                    messageCenterService.add('danger', response.data.name[0], {});
                
                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                if (typeof response.data === 'string' || response.data instanceof String)
                    messageCenterService.add('danger', response.data, {});

                ctrl.dataLoading = false;
            };

            OrganizationMember.save(data, success, error);
        };

        // Remove a user from an organization
        ctrl.remove = function(orga, member) {
            messageCenterService.reset();

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                $rootScope.arrayRemove(ctrl.current.members, member);
            };

            OrganizationMember.delete({oid: orga.id, uid: member.id}, success);
        };

    });
