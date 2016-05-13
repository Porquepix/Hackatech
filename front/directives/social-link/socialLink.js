
    app.directive('socialLink', function() {
        return {
            restrict: 'E',
            scope: {
                variable: '=of'
            },
            templateUrl: './directives/social-link/social-link.html'
        };
    });  
