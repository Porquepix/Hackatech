    /**
     * News Controller. Available in news pages.
     */
    app.controller('NewsLatestCtrl', function($http, $stateParams, News, dateStdFormater) {
        var ctrl = this;

        // All news
        ctrl.news = {};

        ctrl.loadLatestNews = function() {
            var success = function(response) {
                ctrl.news = response;
                dateStdFormater.format(ctrl.news, ['created_at']);
            };

            News.latest({hid: $stateParams.hackathonId, nid: 'latest'}, success);
        };
        ctrl.loadLatestNews();

    });