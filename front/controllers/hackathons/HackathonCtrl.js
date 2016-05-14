    /**
     * Hackathon Controller. Available in hackathon pages.
     */
    app.controller('HackathonCtrl', function($http, $state, $stateParams, Hackathon, dateStdFormater) {
        var ctrl = this;

        // All hackathons
        ctrl.hackathons = [];

        // Initialize the data about the hackathons
        ctrl.init = function() {
            var filter = {};
            filter.page = $stateParams.page;
            q = $stateParams.q;
            if (q) {
                ctrl.q = q;
                filter.q = q;
            }

            var success = function(response) {
                ctrl.hackathons = response;
                dateStdFormater.format(ctrl.hackathons.data, ['beginning']);
                ctrl.hackathons.data.forEach(function(e) {
                    e.two = e.name;
                    e.two = e.two.charAt(0).toUpperCase() + e.two.charAt(1).toLowerCase();

                    ctrl.getColor(e);
                });
            };

            Hackathon.search(filter, success);
        };
        ctrl.init();

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
