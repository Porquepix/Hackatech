    app.factory('News', function($resource) {
        return $resource(api('hackathons_news'), { hid: '@_hid', nid: '@_nid' }, {
            update: {
                method: 'PUT' // this method issues a PUT request
            },
            latest: {
                method: 'GET',
                isArray: true
            },
            search: {
                method: 'GET',
                isArray: true
            }
        });
    });