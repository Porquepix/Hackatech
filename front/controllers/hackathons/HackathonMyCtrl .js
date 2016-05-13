(function() {


    /**
     * Hackathon Controller. Available in hackathon pages.
     */
    app.controller('HackathonMyCtrl', function($rootScope, $http) {
        var ctrl = this;

        // All hackathons
        ctrl.hackathons = [];


        ctrl.initMy = function() {
            $http.get(api('participate_hackathons').format([$rootScope.currentUser.id]), {}).then(function(response) {
                ctrl.hackathons.participate = response.data;
                ctrl.hackathons.participate.forEach(function(e) {
                    e.beginning_std = e.beginning.replace(/(.+) (.+)/, "$1T$2Z");
                    e.beginning_std = new Date(e.beginning_std);
                    e.beginning_std.setHours(e.beginning_std.getHours() - 1);

                    e.ending_std = e.ending.replace(/(.+) (.+)/, "$1T$2Z");
                    e.ending_std = new Date(e.ending_std);
                    e.ending_std.setHours(e.ending_std.getHours() - 1);
                });
            });

            $http.get(api('organize_hackathons').format([$rootScope.currentUser.id]), {}).then(function(response) {
                ctrl.hackathons.organizer = response.data.organization_admin;
                ctrl.hackathons.organizer.forEach(function(e) {
                    e.isAdmin = true;
                });
                ctrl.hackathons.organizer = ctrl.hackathons.organizer.concat(response.data.organization_member);
                ctrl.hackathons.organizer.forEach(function(organization) {
                    organization.hackathons.forEach(function(e) {
                        e.beginning_std = e.beginning.replace(/(.+) (.+)/, "$1T$2Z");
                        e.beginning_std = new Date(e.beginning_std);
                        e.beginning_std.setHours(e.beginning_std.getHours() - 1);

                        e.ending_std = e.ending.replace(/(.+) (.+)/, "$1T$2Z");
                        e.ending_std = new Date(e.ending_std);
                        e.ending_std.setHours(e.ending_std.getHours() - 1);
                    });
                });
            });
        };

    });

});