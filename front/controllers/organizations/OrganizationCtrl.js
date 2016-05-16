    app.controller('OrganizationCtrl', function($scope, $rootScope, $http, messageCenterService, Organization, OrganizationMember, MyOrganization) {
        var ctrl = this;
        // All organisations of the user
        ctrl.orga = {};

        // Get the organizations of the user
        ctrl.init = function() {
            var success = function(response) {
                ctrl.orga = response.admin;
                ctrl.orga.forEach(function(e) {
                    e.isAdmin = true;
                });
                ctrl.orga = ctrl.orga.concat(response.member);
            };

            MyOrganization.get({uid: $rootScope.currentUser.id}, success);
        };
        ctrl.init();

        // Delete the organization
        ctrl.delete = function(orga) {
            messageCenterService.reset();

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                $rootScope.arrayRemove(ctrl.orga, orga);
            };

            Organization.delete({oid: orga.id}, success);
        };

        // Quit an organization
        ctrl.quit = function(orga) {
            messageCenterService.reset();

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                $rootScope.arrayRemove(ctrl.orga, orga);
            };

            OrganizationMember.delete({oid: orga.id, uid: $rootScope.currentUser.id}, success);
        };
    });