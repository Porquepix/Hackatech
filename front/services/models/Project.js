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