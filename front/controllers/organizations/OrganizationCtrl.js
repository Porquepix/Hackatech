    /**
     * Organization Controller. Available in organization pages.
     */
    app.controller('OrganizationCtrl', function($scope, $rootScope, $http, messageCenterService) {
        var ctrl = this;
        // All organisations of the user
        ctrl.orga = {};

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
        ctrl.init();

        // Delete the organization
        ctrl.delete = function(orga) {
            messageCenterService.reset();
            $http.delete(api('organizations_delete').format([orga.id]), {}).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                var index = ctrl.orga.indexOf(orga);
                ctrl.orga.splice(index, 1);
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