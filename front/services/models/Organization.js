    app.factory('Organization', function($resource) {
        return $resource(api('organizations'), { oid: '@_oid' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            },
        });
    });

    app.factory('OrganizationMember', function($resource) {
        return $resource(api('organizations_members'), { oid: '@_oid', uid: '@_uid' }, {
        });
    });

    app.service('OrganizationHackathon', function($http) {
        var service = this;

        service.get = function(data, success, error) {
            $http.get(api('organizations_hackathons').format([data.oid]), {}).then(function (response) {
                    success(response.data);
                }, error);
        };
    });

    app.service('MyOrganization', function($http) {
        var service = this;

        service.get = function(data, success, error) {
            $http.get(api('user_organizations').format([data.uid]), {}).then(function (response) {
                    success(response.data);
                }, error);
        };
    });