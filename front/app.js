(function() {

    // URL of each API functions
    api = function(name) {
        var routes = {
            index: '/',
            
            auth: '/authenticate',
            auth_user: '/authenticate/user',
            register: '/register',
            password_email: '/password/email',
            password_reset: '/password/reset',
            profil_edit: '/users/{0}',
            user_autocomplete: '/users/autocomplete/',

            user_organizations: '/users/{0}/organizations',
            organizations_view: '/organizations/{0}',
            organizations_create: '/organizations',
            organizations_edit: '/organizations/{0}',
            organizations_delete: '/organizations/{0}',
            organizations_add_user: '/organizations/{0}/members',
            organizations_remove_user: '/organizations/{0}/members/{1}',

            hackathons: '/hackathons',
        };

        return "http://api.hackatech.alexis-andrieu.fr" + routes[name];
    };

    // Define our application
    app = angular
            .module('hackatech', ['ui.router', 'ngAnimate', 'satellizer', 'MessageCenterModule', 'angucomplete-alt', 'btford.markdown'])
            .config(config)
            .run(run);

    function config($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide) {
        function redirectWhenLoggedOut($q, $injector) {
            return {

                responseError: function(rejection) {
                    // Need to use $injector.get to bring in $state or else we get
                    // a circular dependency error
                    var $state = $injector.get('$state');

                    // Instead of checking for a status code of 400 which might be used
                    // for other reasons in Laravel, we check for the specific rejection
                    // reasons to tell us if we need to redirect to the login state
                    var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                    // Loop through each rejection reason and redirect to the login
                    // state if one is encountered
                    angular.forEach(rejectionReasons, function(value, key) {
                        if(rejection.data.error === value) {

                            // If we get a rejection corresponding to one of the reasons
                            // in our array, we know we need to authenticate the user so 
                            // we can remove the current user from local storage
                            localStorage.removeItem('user');

                            // Send the user to the auth state so they can login
                            $state.go('login');
                        }
                    });

                    return $q.reject(rejection);

                }
            }; // end object
        }

        // Setup for the $httpInterceptor
        $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);

        // Push the new factory onto the $http interceptor array
        $httpProvider.interceptors.push('redirectWhenLoggedOut');

        $authProvider.loginUrl = api('auth');

        $stateProvider
            .state('error_404', {
                url: '/e404',
                templateUrl: './app-view/404.html',
            })

            .state('index', {
                url: '',
                templateUrl: './app-view/home.html',
                controller: 'HomeController as homeCtrl'
            })
            .state('indexAg', {
                url: '/',
                templateUrl: './app-view/home.html',
                controller: 'HomeController as homeCtrl'
            })
            .state('indexAuth', {
                url: '/home',
                templateUrl: './app-view/home.html',
                controller: 'HomeController as homeCtrl'
            })

            // AUTH
            .state('login', {
                url: '/login',
                templateUrl: './app-view/login.html',
                controller: 'LoginController as loginCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: './app-view/register.html',
                controller: 'RegisterController as registerCtrl'
            })            
            .state('passwd_email', {
                url: '/password/email',
                templateUrl: './app-view/passwd_reset_email.html',
                controller: 'PasswordController as passwordCtrl'
            }) 
            .state('passwd_reset', {
                url: '/password/reset',
                templateUrl: './app-view/passwd_reset.html',
                controller: 'PasswordController as passwordCtrl'
            })  

            // USER          
            .state('profile', {
                url: '/profile',
                templateUrl: './app-view/profile.html',
                controller: 'UserController as userCtrl'
            })
            .state('profile_edit', {
                url: '/profile/edit',
                templateUrl: './app-view/profile_edit.html',
                controller: 'UserController as userCtrl'
            })

            // ORGANIZATIONS
            .state('my_organizations', {
                url: '/profile/organizations',
                templateUrl: './app-view/organizations/my.html',
                controller: 'OrganizationController as orgaCtrl'
            })
            .state('organization_create', {
                url: '/organizations/create',
                templateUrl: './app-view/organizations/edit.html',
                controller: 'OrganizationController as orgaCtrl'
            })
            .state('organization_edit', {
                url: '/organizations/{organizationId}/edit',
                templateUrl: './app-view/organizations/edit.html',
                controller: 'OrganizationController as orgaCtrl'
            })            
            .state('organization_members', {
                url: '/organizations/{organizationId}/members',
                templateUrl: './app-view/organizations/member.html',
                controller: 'OrganizationController as orgaCtrl'
            })

            // HACKATHONS
            .state('hackathons', {
                url: '/hackathons?page',
                templateUrl: './app-view/hackathons/index.html',
                controller: 'HackathonController as hackCtrl'
            });
         $urlRouterProvider.otherwise('/e404');

         // Config for laravel
         $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    }

    function run($rootScope, $state, user, $auth) {
        $rootScope.range = function(n) {
            return new Array(n);
        };

        var userService = user;

        // $stateChangeStart is fired whenever the state changes. We can use some parameters
        // such as toState to hook into details about the state as it is changing
        $rootScope.$on('$stateChangeStart', function(event, toState) {

            if (localStorage.getItem('satellizer_token')) {
                userService.getFreshData(function(data) {}, function(data) {
                    $auth.logout().then(function() {
                        // Remove the authenticated user from local storage
                        localStorage.removeItem('user');

                        // Flip authenticated to false so that we no longer
                        // show UI elements dependant on the user being logged in
                        $rootScope.authenticated = false;

                        // Remove the current user info from rootscope
                        $rootScope.currentUser = null;
                    });
                });
            }

            // Grab the user from local storage and parse it to an object
            var user = JSON.parse(localStorage.getItem('user'));            

            // If there is any user data in local storage then the user is quite
            // likely authenticated. If their token is expired, or if they are
            // otherwise not actually authenticated, they will be redirected to
             // the auth state because of the rejected request anyway
            if(user) {

                // The user's authenticated state gets flipped to
                // true so we can now show parts of the UI that rely
                // on the user being logged in
                $rootScope.authenticated = true;

                // Putting the user's data on $rootScope allows
                // us to access it anywhere across the app. Here
                // we are grabbing what is in local storage
                $rootScope.currentUser = user;

                // If the user is logged in and we hit the auth route we don't need
                // to stay there and can send the user to the main state
                $authState = ['login', 'register', 'passwd_email', 'passwd_reset'];
                if($authState.indexOf(toState.name) != -1) {

                    // Preventing the default behavior allows us to use $state.go
                    // to change states
                    event.preventDefault();

                    // go to the "main" state which in our case is index
                   $state.go('indexAuth');
                }       
            }

            $rootScope.currentState = toState.name;
        });
    }


    /**
     * DIRECTIVES
     */

    app.directive('socialLink', function() {
        return {
            restrict: 'E',
            scope: {
                variable: '=of'
            },
            templateUrl: './app-view/directive/social-link.html'
        };
    });         

    app.directive('socialForm', function() {
        return {
            restrict: 'E',
            scope: {
                model: '=model',
            },
            templateUrl: './app-view/directive/social-form.html'
        };
    });  

})();