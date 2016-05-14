    /**
     * News Controller. Available in news pages.
     */
    app.controller('NewsCtrl', function($rootScope, $http, $state, $stateParams, Hackathon, News, dateStdFormater, messageCenterService) {
        var ctrl = this;

        // All news
        ctrl.news = {};

        ctrl.loadHackathonData = function(callback) {
            var success = function(response) {
                ctrl.hackathon = response;
            };
            var error = function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            };

            Hackathon.get({hid: $stateParams.hackathonId}, success, error);
        };

        ctrl.init = function() {
            ctrl.loadHackathonData();

            var success = function(response) {
                ctrl.news = response;
                dateStdFormater.format(ctrl.news, ['created_at']);
            };

            News.search({hid: $stateParams.hackathonId}, success);
        };
        ctrl.init();


        ctrl.delete = function(news) {
            messageCenterService.reset();

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                $rootScope.arrayRemove(ctrl.news, news);
            };

            News.delete({hid: $stateParams.hackathonId, nid: news.id}, success);
        };

    });
