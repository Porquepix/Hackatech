(function() {

    api = function(url) {
        return "http://api.hackatech.alexis-andrieu.fr" + url;
    };


    app = angular.module('hackatech', ['ngRoute', 'ngCookies']).config(config);

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'app-view/home.html',
                controllerAs: 'homeCtrl'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'app-view/login.html',
                controllerAs: 'loginCtrl'
            })

            .otherwise({ redirectTo : '/login' });
    }

    app.controller('AppController', function() {
        this.isLogged = function() {
            return false;
        };
        this.loggedUser = null;
    });

})();