
    app.directive('socialForm', function() {
        return {
            restrict: 'E',
            scope: {
                model: '=model',
            },
            templateUrl: './directives/social-form/social-form.html'
        };
    }); 
