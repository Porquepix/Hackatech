    /**
     * News Controller. Available in news pages.
     */
    app.controller('NewsLatestCtrl', function($http, $stateParams) {
        var ctrl = this;

        // All news
        ctrl.news = {};

        ctrl.loadLatestNews = function() {
            $http.get(api('hackathons_news_latest').format([$stateParams.hackathonId]), {}).then(function(response) {
                ctrl.news = response.data;
                ctrl.news.forEach(function(e) {
                    e.created_at = new Date(e.created_at);
                    e.created_at.setHours(e.created_at.getHours() - 1);
                });
            });
        };
        ctrl.loadLatestNews();

    });