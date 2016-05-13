(function() {


    /**
     * Hackathon Controller. Available in hackathon pages.
     */
    app.controller('HackathonCtrl', function($http, $state, $stateParams) {
        var ctrl = this;

        // All hackathons
        ctrl.hackathons = [];

        ctrl.init();

        // Initialize the data about the hackathons
        ctrl.init = function() {
            page = $stateParams.page;
            q = $stateParams.q;
            if (q) {
                ctrl.q = q;
                var search = '&q=' + q;
            }
            $http.get(api('hackathons') + '?page=' + page + search, {}).then(function(response) {
                ctrl.hackathons = response.data;
                ctrl.hackathons.data.forEach(function(e) {
                    e.beginning_std = e.beginning.replace(/(.+) (.+)/, "$1T$2Z");
                    e.beginning_std = new Date(e.beginning_std);
                    e.beginning_std.setHours(e.beginning_std.getHours() - 1);

                    e.two = e.name;
                    e.two = e.two.charAt(0).toUpperCase() + e.two.charAt(1).toLowerCase();

                    ctrl.getColor(e);
                });
            });
        };

        // Retrieve the class color of an hackathon. This class is used in index and view pages.
        ctrl.getColor = function(hackathon) {
            var classes = ['rgba-blue-strong', 'rgba-red-strong', 'rgba-pink-strong', 'rgba-purple-strong', 'rgba-indigo-strong', 'rgba-cyan-strong', 'rgba-green-strong', 'rgba-orange-strong'];
            var random = (hackathon.name.charCodeAt(0) + hackathon.name.charCodeAt(1) + hackathon.max_participant + hackathon.abstract.charCodeAt(0)) % classes.length;
            hackathon.color = classes[random];
        };

        ctrl.search = function() {
            var page = $stateParams.page;
            if (page == null) {
                page = 1;
            }
            $state.go('hackathons', {page:page, q:ctrl.q});
        };

    });

});