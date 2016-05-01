(function() {

    app.controller('HomeController', function() {
        this.nbChallengers = 0;
        this.nbHackathons = 0;
    });


    app.controller('LoginController', function(AuthService) {
        var ctrl = this;

        ctrl.login = function() {
            this.dataLoading = true;
            AuthService.login(ctrl.email, ctrl.password, function(response) {
                if (response.data.auth) {

                } else {
                    ctrl.errorMessage = response.data.message;
                    ctrl.dataLoading = false;
                    ctrl.password = '';
                }
            });
        }
    });

})();