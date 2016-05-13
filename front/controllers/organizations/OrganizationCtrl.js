(function() {

    /**
     * Organization Controller. Available in organization pages.
     */
    app.controller('OrganizationController', function($scope, $rootScope, $http, messageCenterService) {
        var ctrl = this;
        // All organisations of the user
        ctrl.orga = {};

        ctrl.init();

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

});