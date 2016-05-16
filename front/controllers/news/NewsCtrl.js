    app.controller('NewsCtrl', function($rootScope, $http, $state, $stateParams, Hackathon, News, dateStdFormater, messageCenterService) {
        var ctrl = this;

        // All news
        ctrl.news = {};

        // Load hackathon data for the news
        ctrl.loadHackathonData = function(callback) {
            var success = function(response) {
                ctrl.hackathon = response;
            };
            var error = function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            };

            Hackathon.get({hid: $stateParams.hackathonId}, success, error);
        };

        // Load all news which concern the hackathon
        ctrl.init = function() {
            ctrl.loadHackathonData();

            var success = function(response) {
                ctrl.news = response;
                dateStdFormater.format(ctrl.news, ['created_at']);
            };

            News.search({hid: $stateParams.hackathonId}, success);
        };
        ctrl.init();

        // Delete a news
        ctrl.delete = function(news) {
            messageCenterService.reset();

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                $rootScope.arrayRemove(ctrl.news, news);
            };

            News.delete({hid: $stateParams.hackathonId, nid: news.id}, success);
        };

    });
