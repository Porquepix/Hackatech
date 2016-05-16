    /**
     * News Controller. Available in news pages.
     */
    app.controller('NewsUpdateCtrl', function($scope, $http, $state, messageCenterService, form, $stateParams, Hackathon, News) {
        var ctrl = this;

        // Current news
        ctrl.current = {};

        ctrl.loadHackathonData = function(callback) {
            var success = function(response) {
                ctrl.hackathon = response;
                callback();
            };
            var error = function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            };

            Hackathon.get({hid: $stateParams.hackathonId}, success, error);
        };

        ctrl.loadData = function() {
            ctrl.loadHackathonData(function() {
                if (!ctrl.hackathon.isAdmin && !ctrl.hackathon.isOrganizator) {
                    $state.go('hackathons_news', {hackathonId: $stateParams.hackathonId});
                }
            });

            if ($stateParams.newsId != null) {
                var success = function(response) {
                    ctrl.current = response;
                };
                News.get({hid: $stateParams.hackathonId, nid: $stateParams.newsId}, success);
            }
        };
        ctrl.loadData();

        ctrl.save = function(news) {
            messageCenterService.reset();

            var data = {};
            data._hid = $stateParams.hackathonId;
            form.populate($scope.form, data);

            var success = function(response) {
                messageCenterService.add('success', response.message, { status: messageCenterService.status.next });
                $state.go('hackathons_news', {hackathonId: $stateParams.hackathonId});
            };
            var error = function(response) {
                if (response.data.name)
                    messageCenterService.add('danger', response.data.name[0], {});

                if (response.data.content)
                    messageCenterService.add('danger', response.data.content[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                if (typeof response.data === 'string' || response.data instanceof String)
                    messageCenterService.add('danger', response.data, {});

                ctrl.dataLoading = false;
            };

            // If null => create case, else edit case
            if ($stateParams.newsId != null) {
                data._nid = $stateParams.newsId;
                News.update(data, success, error);
            } else {
                News.save(data, success, error);
            }
        };

    });