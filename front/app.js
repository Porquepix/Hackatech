    // URL of each API functions
    api = function(name) {
        var routes = {
            // Angular ressources
            hackathons: '/hackathons/:hid',
            hackathons_participants: '/hackathons/:hid/participants/:uid',
            hackathons_news: '/hackathons/:hid/news/:nid',
            hackathons_projects: '/hackathons/:hid/projects/:pid',
            hackathons_projects_members: '/hackathons/:hid/projects/:pid/members/:uid',
            organizations: '/organizations/:oid',
            organizations_members: '/organizations/:oid/members/:uid',
            
            // Other url
            index: '/',
            
            auth: '/authenticate',
            auth_user: '/authenticate/user',
            register: '/register',
            password_email: '/password/email',
            password_reset: '/password/reset',
            profil_edit: '/users/{0}',
            user_autocomplete: '/users/autocomplete/',

            user_organizations: '/users/{0}/organizations',
            organizations_hackathons: '/organizations/{0}/hackathons',

            participate_hackathons: '/users/{0}/hackathons/participate',
            organize_hackathons: '/users/{0}/hackathons/organize',

            hackathons_vote: '/hackathons/{0}/projects/{1}/votes',
            hackathons_ranking: '/hackathons/{0}/ranking',
        };

        return "https://api.hackatech.alexis-andrieu.fr" + routes[name];
    };

    // Define our application
    app = angular
            .module('hackatech', ['ui.router', 'ngResource', 'ngAnimate', 'satellizer', 'MessageCenterModule', 'angucomplete-alt', 'btford.markdown', 'masonry', 'datetimepicker'])
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
                templateUrl: './views/404.html',
            })

            .state('index', {
                url: '',
                templateUrl: './views/home/home.html',
                controller: 'HomeCtrl as homeCtrl'
            })
            .state('indexAg', {
                url: '/',
                templateUrl: './views/home/home.html',
                controller: 'HomeCtrl as homeCtrl'
            })
            .state('indexAuth', {
                url: '/home',
                templateUrl: './views/hackathons/my.html',
                controller: 'HackathonMyCtrl as hackCtrl'
            })
            .state('help', {
                url: '/help',
                templateUrl: './views/soon.html',
            })

            // AUTH
            .state('login', {
                url: '/login',
                templateUrl: './views/login/login.html',
                controller: 'LoginCtrl as loginCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: './views/register/register.html',
                controller: 'RegisterCtrl as registerCtrl'
            })            
            .state('passwd_email', {
                url: '/password/email',
                templateUrl: './views/password/passwd_reset_email.html',
                controller: 'PasswordCtrl as passwordCtrl'
            }) 
            .state('passwd_reset', {
                url: '/password/reset',
                templateUrl: './views/password/passwd_reset.html',
                controller: 'PasswordCtrl as passwordCtrl'
            })  

            // USER          
            .state('profile', {
                url: '/profile',
                templateUrl: './views/users/profile.html',
                controller: 'UserCtrl as userCtrl'
            })
            .state('profile_edit', {
                url: '/profile/edit',
                templateUrl: './views/users/profile_edit.html',
                controller: 'UserCtrl as userCtrl'
            })

            // ORGANIZATIONS
            .state('my_organizations', {
                url: '/profile/organizations',
                templateUrl: './views/organizations/my.html',
                controller: 'OrganizationCtrl as orgaCtrl'
            })
            .state('organization_create', {
                url: '/organizations/create',
                templateUrl: './views/organizations/edit.html',
                controller: 'OrganizationUpdateCtrl as orgaCtrl'
            })
            .state('organization_edit', {
                url: '/organizations/{organizationId}/edit',
                templateUrl: './views/organizations/edit.html',
                controller: 'OrganizationUpdateCtrl as orgaCtrl'
            })            
            .state('organization_members', {
                url: '/organizations/{organizationId}/members',
                templateUrl: './views/organizations/member.html',
                controller: 'OrganizationUpdateCtrl as orgaCtrl'
            })
            .state('organization_hackathons', {
                url: '/organizations/{organizationId}/hackathons',
                templateUrl: './views/organizations/hackathons.html',
                controller: 'OrganizationHackathonCtrl as orgaCtrl'
            })

            // HACKATHONS
            .state('hackathons', {
                url: '/hackathons?page&q',
                templateUrl: './views/hackathons/index.html',
                controller: 'HackathonCtrl as hackCtrl'
            })            
            .state('hackathons_create', {
                url: '/hackathons/create',
                templateUrl: './views/hackathons/edit.html',
                controller: 'HackathonUpdateCtrl as hackCtrl'
            })
            .state('hackathons_view', {
                url: '/hackathons/{hackathonId}',
                templateUrl: './views/hackathons/view.html',
                controller: 'HackathonShowCtrl as hackCtrl'
            })
            .state('my_hackathons', {
                url: '/profile/hackathons',
                templateUrl: './views/hackathons/my.html',
                controller: 'HackathonMyCtrl as hackCtrl'
            })
            .state('hackathons_edit', {
                url: '/hackathons/{hackathonId}/edit',
                templateUrl: './views/hackathons/edit.html',
                controller: 'HackathonUpdateCtrl as hackCtrl'
            })
            .state('hackathons_board', {
                url: '/hackathons/{hackathonId}/board',
                templateUrl: './views/soon.html',
            })
            .state('hackathons_participants', {
                url: '/hackathons/{hackathonId}/participants',
                templateUrl: './views/hackathons/participant.html',
                controller: 'HackathonParticipantCtrl as hackCtrl'
            })

            //NEWS
            .state('hackathons_news', {
                url: '/hackathons/{hackathonId}/news',
                templateUrl: './views/news/index.html',
                controller: 'NewsCtrl as newsCtrl'
            })
            .state('hackathons_news_create', {
                url: '/hackathons/{hackathonId}/news/create',
                templateUrl: './views/news/edit.html',
                controller: 'NewsUpdateCtrl as newsCtrl'
            })
            .state('hackathons_news_edit', {
                url: '/hackathons/{hackathonId}/news/{newsId}/edit',
                templateUrl: './views/news/edit.html',
                controller: 'NewsUpdateCtrl as newsCtrl'
            })

            // PROJECTS
            .state('hackathons_projects', {
                url: '/hackathons/{hackathonId}/projects',
                templateUrl: './views/projects/index.html',
                controller: 'ProjectCtrl as projectCtrl'
            })
            .state('hackathons_projects_create', {
                url: '/hackathons/{hackathonId}/projects/create',
                templateUrl: './views/projects/edit.html',
                controller: 'ProjectUpdateCtrl as projectCtrl'
            })
            .state('hackathons_projects_view', {
                url: '/hackathons/{hackathonId}/projects/{projectId}',
                templateUrl: './views/projects/view.html',
                controller: 'ProjectShowCtrl as projectCtrl'
            })
            .state('hackathons_projects_edit', {
                url: '/hackathons/{hackathonId}/projects/{projectId}/edit',
                templateUrl: './views/projects/edit.html',
                controller: 'ProjectUpdateCtrl as projectCtrl'
            })            
            .state('hackathons_projects_ranking', {
                url: '/hackathons/{hackathonId}/ranking',
                templateUrl: './views/projects/ranking.html',
                controller: 'ProjectRankCtrl as projectCtrl'
            });

            
         $urlRouterProvider.otherwise('/e404');

         // Config for laravel
         $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

        datetimepickerProvider.setOptions({
            sideBySide: true,
            locale: 'en',
            format: 'Y-MM-DD HH:mm'
        });
    }

    function run($rootScope, $state) {
        $rootScope.range = function(n) {
            return new Array(n);
        };

        $rootScope.now = new Date();

        $rootScope.arrayRemove = function(array, element) {
            var index = array.indexOf(element);
            array.splice(index, 1);
        };

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