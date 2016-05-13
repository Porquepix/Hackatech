    // Handle the logout phase
    app.controller('LogoutCtrl', function($state, authtification, $rootScope, messageCenterService) {
        this.logout = function() {
            authtification.logout(function() {
                // Remove the authenticated user from local storage
                localStorage.removeItem('user');

                // Flip authenticated to false so that we no longer
                // show UI elements dependant on the user being logged in
                $rootScope.authenticated = false;

                // Remove the current user info from rootscope
                $rootScope.currentUser = null;

                messageCenterService.add('success', 'You have successfully logout !', { status: messageCenterService.status.next });

                $state.go('index');
            });
        }
    });
