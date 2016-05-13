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