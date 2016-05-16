    app.controller('ProjectRankCtrl', function(Hackathon, Vote, $state, $stateParams) {
        var ctrl = this;

        // Load the data about the hackathon
        ctrl.loadHackathonData = function() {
            var success = function(response) {
                ctrl.hackathon = response.data;
            };
            var error = function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            };

            Hackathon.get({hid: $stateParams.hackathonId}, success, error);
        };

        // Load the ranking of the hackathon
        ctrl.loadData = function() {
            var success = function(response) {
                ctrl.projects = response;
            };
            var error = function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            };

            Vote.ranking({hid: $stateParams.hackathonId}, success, error);
        }

        ctrl.loadHackathonData();
        ctrl.loadData();

    });