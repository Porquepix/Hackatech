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
            hackathons_view: '/hackathons/{0}',
            hackathons_create: '/hackathons',
            hackathons_edit: '/hackathons/{0}',
            hackathons_delete: '/hackathons/{0}',

            hackathons_get_users: '/hackathons/{0}/participants',
            hackathons_add_user: '/hackathons/{0}/participants',
            hackathons_update_user: '/hackathons/{0}/participants/{1}',
            hackathons_remove_user: '/hackathons/{0}/participants/{1}',

            hackathons_news: '/hackathons/{0}/news',
            hackathons_news_latest: '/hackathons/{0}/news/latest',
            hackathons_news_create: '/hackathons/{0}/news',
            hackathons_news_edit: '/hackathons/{0}/news/{1}',
            hackathons_news_delete: '/hackathons/{0}/news/{1}',
            hackathons_news_view: '/hackathons/{0}/news/{1}',
        };

        return "http://api.hackatech.alexis-andrieu.fr" + routes[name];
    };

    // Define our application
    app = angular
            .module('hackatech', ['ui.router', 'ngAnimate', 'satellizer', 'MessageCenterModule', 'angucomplete-alt', 'btford.markdown', 'masonry', 'datetimepicker'])
            .config(config)
            .run(run);

    function config($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide, datetimepickerProvider) {
        function redirectWhenLoggedOut($q, $injector) {
            return {

                responseError: function(rejection) {
                    // Need to use $injector.get to bring in $state or else we get
                    // a circular dependency error
                    var $state = $injector.get('$state');
                    var $rootScope = $injector.get('$rootScope');

                    // Instead of checking for a status code of 400 which might be used
                    // for other reasons in Laravel, we check for the specific rejection
                    // reasons to tell us if we need to redirect to the login state
                    var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                    // Loop through each rejection reason and redirect to the login
                    // state if one is encountered
                    angular.forEach(rejectionReasons, function(value, key) {
                        if(rejection.data.error === value) {

                            $rootScope.authenticated = false;
                            $rootScope.currentUser = null;

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
            })            
            .state('hackathons_create', {
                url: '/hackathons/create',
                templateUrl: './app-view/hackathons/edit.html',
                controller: 'HackathonController as hackCtrl'
            })
            .state('hackathons_view', {
                url: '/hackathons/{hackathonId}',
                templateUrl: './app-view/hackathons/view.html',
                controller: 'HackathonController as hackCtrl'
            })
            .state('hackathons_edit', {
                url: '/hackathons/{hackathonId}/edit',
                templateUrl: './app-view/hackathons/edit.html',
                controller: 'HackathonController as hackCtrl'
            })
            .state('hackathons_projects', {
                url: '/hackathons/{hackathonId}/projects',
                templateUrl: './app-view/hackathons/edit.html',
                controller: 'HackathonController as hackCtrl'
            })
            .state('hackathons_board', {
                url: '/hackathons/{hackathonId}/board',
                templateUrl: './app-view/hackathons/participant.html',
                controller: 'HackathonController as hackCtrl'
            })
            .state('hackathons_participants', {
                url: '/hackathons/{hackathonId}/participants',
                templateUrl: './app-view/hackathons/participant.html',
                controller: 'HackathonController as hackCtrl'
            })

            //NEWS
            .state('hackathons_news', {
                url: '/hackathons/{hackathonId}/news',
                templateUrl: './app-view/hackathons-news/index.html',
                controller: 'NewsController as newsCtrl'
            })
            .state('hackathons_news_create', {
                url: '/hackathons/{hackathonId}/news/create',
                templateUrl: './app-view/hackathons-news/edit.html',
                controller: 'NewsController as newsCtrl'
            })
            .state('hackathons_news_edit', {
                url: '/hackathons/{hackathonId}/news/{newsId}/edit',
                templateUrl: './app-view/hackathons-news/edit.html',
                controller: 'NewsController as newsCtrl'
            });

            
         $urlRouterProvider.otherwise('/e404');

         // Config for laravel
         $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

        datetimepickerProvider.setOptions({
            locale: 'fr',
            format: 'Y-MM-DD HH:mm'
        });
    }

    function run($rootScope, $state, user, $auth) {
        $rootScope.range = function(n) {
            return new Array(n);
        };

        $rootScope.now = new Date();

        var userService = user;

        // $stateChangeStart is fired whenever the state changes. We can use some parameters
        // such as toState to hook into details about the state as it is changing
        $rootScope.$on('$stateChangeStart', function(event, toState) {

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