    app.factory('Hackathon', function($resource) {
        return $resource(api('hackathons'), { query: '@query', hid: '@_hid' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            },
            search: {
                method: 'GET',
                params: {
                    query: '@query'
                }
            }
        });
    });

    app.factory('HackathonParticipants', function($resource) {
        return $resource(api('hackathons_participants'), { hid: '@_hid', uid: '@_uid' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            },
            get: {
                isArray: true
            }
        });
    });

    app.service('MyHackathon', function($http) {
        var service = this;

        service.getParticipation = function(data, success, error) {
            $http.get(api('participate_hackathons').format([data.uid]), {}).then(function (response) {
                    success(response.data);
                }, error);
        };

        service.getOrganizer = function(data, success, error) {
            $http.get(api('organize_hackathons').format([data.uid]), {}).then(function (response) {
                    success(response.data);
                }, error);
        };
    });