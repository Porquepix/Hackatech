    /**
     * Hackathon Controller. Available in hackathon pages.
     */
    app.controller('HackathonMyCtrl', function($rootScope, $http, MyHackathon, dateStdFormater) {
        var ctrl = this;

        // All hackathons
        ctrl.hackathons = [];

        ctrl.initMy = function() {
            var successP = function(response) {
                ctrl.hackathons.participate = response;
                dateStdFormater.format(ctrl.hackathons.participate, ['beginning', 'ending']);
            };

            MyHackathon.getParticipation({uid: $rootScope.currentUser.id}, successP);

            var successO = function(response) {
                ctrl.hackathons.organizer = response.organization_admin;
                ctrl.hackathons.organizer.forEach(function(e) {
                    e.isAdmin = true;
                });
                ctrl.hackathons.organizer = ctrl.hackathons.organizer.concat(response.organization_member);
                ctrl.hackathons.organizer.forEach(function(organization) {
                    dateStdFormater.format(organization.hackathons, ['beginning', 'ending']);
                });
            };

            MyHackathon.getOrganizer({uid: $rootScope.currentUser.id}, successO);
        };
        ctrl.initMy();

    });