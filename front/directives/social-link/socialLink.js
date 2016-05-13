(function() {

    app.directive('socialLink', function() {
        return {
            restrict: 'E',
            scope: {
                variable: '=of'
            },
            templateUrl: './social-link.html'
        };
    });  

})();