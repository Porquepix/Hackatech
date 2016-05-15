    app.factory('Project', function($resource) {
        return $resource(api('hackathons_projects'), { hid: '@_hid', pid: '@_pid' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            },
            search: {
                method: 'GET'
            }
        });
    });


    app.factory('ProjectMembers', function($resource) {
        return $resource(api('hackathons_projects_members'), { hid: '@_hid', pid: '@_pid', uid: '@_uid' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            },
            search: {
                method: 'GET',
                isArray: true
            }
        });
    });

    app.service('Vote', function($http) {
        var service = this;

        service.save = function(data, success, error) {
            $http.post(api('hackathons_vote').format([data.hid, data.pid]), data).then(function (response) {
                    success(response.data);
                }, error);
        };

        service.update = function(data, success, error) {
            $http.put(api('hackathons_vote').format([data.hid, data.pid]), data).then(function (response) {
                    success(response.data);
                }, error);
        };

        service.ranking = function(data, success, error) {
            $http.get(api('hackathons_ranking').format([data.hid]), data).then(function (response) {
                    success(response.data);
                }, error);
        };
    });