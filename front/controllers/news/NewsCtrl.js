    /**
     * News Controller. Available in news pages.
     */
    app.controller('NewsCtrl', function($http, $state, $stateParams) {
        var ctrl = this;

        // All news
        ctrl.news = {};

        ctrl.loadHackathonData = function(callback) {
            $http.get(api('hackathons_view').format([$stateParams.hackathonId]), {}).then(function(response) {
                ctrl.hackathon = response.data;

                if (callback)
                    callback();
            }, function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            });
        };

        ctrl.init = function() {
            ctrl.loadHackathonData();

            $http.get(api('hackathons_news').format([$stateParams.hackathonId]), {}).then(function(response) {
                ctrl.news = response.data;
                ctrl.news.forEach(function(e) {
                    e.created_at = new Date(e.created_at);
                    e.created_at.setHours(e.created_at.getHours() - 1);
                });
            });
        };
        ctrl.init();

    });
