    /**
     * News Controller. Available in news pages.
     */
    app.controller('NewsUpdateCtrl', function($scope, $http, $state, messageCenterService, form, $stateParams) {
        var ctrl = this;

        // Current news
        ctrl.current = {};

        ctrl.loadHackathonData = function(callback) {
            $http.get(api('hackathons_view').format([$stateParams.hackathonId]), {}).then(function(response) {
                ctrl.hackathon = response.data;

                if (callback)
                    callback();
            }, function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            });
        };

        ctrl.loadData = function() {
            ctrl.loadHackathonData(function() {
                if (!ctrl.hackathon.isAdmin && !ctrl.hackathon.isOrganizator) {
                    $state.go('hackathons_news', {hackathonId: $stateParams.hackathonId});
                }
            });

            if ($stateParams.newsId != null) {
                $http.get(api('hackathons_news_view').format([$stateParams.hackathonId, $stateParams.newsId]), {}).then(function(response) {
                    ctrl.current = response.data;
                });
            }
        };
        ctrl.loadData();

        ctrl.save = function(newsId) {
            messageCenterService.reset();

            var data = {};
            form.populate($scope.form, data);

            var succesCallback = function(response) {
                messageCenterService.add('success', response.data.message, {});
                ctrl.dataLoading = false;
            };
            var errorCallback = function(response) {
                if (response.data.name)
                    messageCenterService.add('danger', response.data.name[0], {});

                if (response.data.content)
                    messageCenterService.add('danger', response.data.content[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                ctrl.dataLoading = false;
            };

            // If null => create case, else edit case
            if ($stateParams.newsId != null) {
                $http.put(api('hackathons_news_edit').format([$stateParams.hackathonId, $stateParams.newsId]), data).then(succesCallback, errorCallback);
            } else {
                $http.post(api('hackathons_news_create').format([$stateParams.hackathonId]), data).then(succesCallback, errorCallback);
            }
        };

        ctrl.delete = function(news) {
            messageCenterService.reset();
            $http.delete(api('hackathons_news_delete').format([$stateParams.hackathonId, news.id]), {}).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                var index = ctrl.news.indexOf(news);
                ctrl.news.splice(index, 1);
            });
        };

    });