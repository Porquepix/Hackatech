(function() {

    /**
     * Organization Controller. Available in organization pages.
     */
    app.controller('OrganizationController', function($http, $state, $stateParams) {
        var ctrl = this;
        // All Hackathons of the organization
        ctrl.hackathons = {};

        ctrl.loadHackathons();

        // Load the data for organization hackthons page
        ctrl.loadHackathons = function() {
            $http.get(api('organizations_hackathons').format([$stateParams.organizationId]), {}).then(function(response) {
                    ctrl.hackathons = response.data;
                    ctrl.hackathons.forEach(function(e) {
                        e.beginning_std = e.beginning.replace(/(.+) (.+)/, "$1T$2Z");
                        e.beginning_std = new Date(e.beginning_std);
                        e.beginning_std.setHours(e.beginning_std.getHours() - 1);

                        e.ending_std = e.ending.replace(/(.+) (.+)/, "$1T$2Z");
                        e.ending_std = new Date(e.ending_std);
                        e.ending_std.setHours(e.ending_std.getHours() - 1);
                    });
                }, function(response) {
                    $state.go('my_organizations');
                });
        };

    });

});