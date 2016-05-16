    app.controller('HomeCtrl', function($http) {
        var ctrl = this;

        // Get some stats to display on the home page
        $http.get(api('index'), {}).then(function(response) {
            ctrl.nbChallengers = response.data.nbChallengers;
            ctrl.nbHackathons = response.data.nbHackathons;
        });
    });