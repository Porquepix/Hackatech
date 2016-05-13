(function() {

    app.directive('socialForm', function() {
        return {
            restrict: 'E',
            scope: {
                model: '=model',
            },
            templateUrl: './social-form.html'
        };
    }); 

})();