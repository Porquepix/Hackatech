(function() {

    route = function(name) {
        var routes = {
            index: '/',
            login: '/login'
        };

        return routes[name];
    }

    api = function(url) {
        return "http://api.hackatech.alexis-andrieu.fr" + url;
    };


    app = angular.module('hackatech', ['ngRoute', 'satellizer']).config(config);

    function config($routeProvider, $authProvider) {
        $authProvider.loginUrl = api('/authenticate');

        $routeProvider
            .when(route('index'), {
                controller: 'HomeController',
                templateUrl: 'app-view/home.html',
                controllerAs: 'homeCtrl'
            })

            .when(route('login'), {
                controller: 'LoginController',
                templateUrl: 'app-view/login.html',
                controllerAs: 'loginCtrl'
            })

            .otherwise({ redirectTo : route('login') });
    }

    app.controller('AppController', function() {
        this.isLogged = function() {
            return false;
        };
        this.loggedUser = null;


        this.route = route;
    });

})();