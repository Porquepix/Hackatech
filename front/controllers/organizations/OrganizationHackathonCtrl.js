    app.controller('OrganizationHackathonCtrl', function($http, $state, $stateParams, OrganizationHackathon, dateStdFormater) {
        var ctrl = this;
        // All Hackathons of the organization
        ctrl.hackathons = {};

        // Load the data for organization hackthons page
        ctrl.loadHackathons = function() {
            var success = function(response) {
                ctrl.hackathons = response;
                dateStdFormater.format(ctrl.hackathons, ['beginning', 'ending']);
            };
            var error = function(response) {
                $state.go('my_organizations');
            };

            OrganizationHackathon.get({oid: $stateParams.organizationId}, success, error);
        };
        ctrl.loadHackathons();
    });
