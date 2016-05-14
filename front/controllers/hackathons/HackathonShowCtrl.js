    /**
     * Hackathon Controller. Available in hackathon pages.
     */
    app.controller('HackathonShowCtrl', function($rootScope, $http, $state, messageCenterService, $stateParams, Hackathon, HackathonParticipants, dateStdFormater) {
        var ctrl = this;

        // Hackathon which is currently loaded
        ctrl.current = {};

        // Load data about one hackathon which the id is in the url
        ctrl.loadData = function() {
            if ($stateParams.hackathonId != null) {
                var success = function(response) {
                    ctrl.current = response;
                    ctrl.current.data.beginning_std = dateStdFormater.format(ctrl.current.data.beginning);
                    ctrl.current.data.ending_std = dateStdFormater.format(ctrl.current.data.ending);
                    ctrl.getColor(ctrl.current.data);
                };
                var error = function(response) {
                    $state.go('hackathons');
                };

                Hackathon.get({hid: $stateParams.hackathonId}, success, error);
            }
        };
        ctrl.loadData();

        // Retrieve the class color of an hackathon. This class is used in index and view pages.
        ctrl.getColor = function(hackathon) {
            var classes = ['rgba-blue-strong', 'rgba-red-strong', 'rgba-pink-strong', 'rgba-purple-strong', 'rgba-indigo-strong', 'rgba-cyan-strong', 'rgba-green-strong', 'rgba-orange-strong'];
            var random = (hackathon.name.charCodeAt(0) + hackathon.name.charCodeAt(1) + hackathon.max_participant + hackathon.abstract.charCodeAt(0)) % classes.length;
            hackathon.color = classes[random];
        };

        // Add a registration of a user in an hackathon.
        ctrl.register = function() {
            messageCenterService.reset();

            var data = {};
            data._hid = $stateParams.hackathonId;
            if ($rootScope.currentUser)
                data.user_id = $rootScope.currentUser.id;

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                ctrl.current.nbParticipants += 1;
                ctrl.current.isRegistered = true;
            };
            var error = function(response) {
                if (response.data.user_id)
                    messageCenterService.add('danger', response.data.user_id[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});
            };

            HackathonParticipants.save(data, success, error);
        };

        // Cancel the registration of a user.
        ctrl.cancelRegistration = function() {
            messageCenterService.reset();

            var data = {
                hid: $stateParams.hackathonId,
                uid: $rootScope.currentUser.id
            };

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                ctrl.current.nbParticipants -= 1;
                ctrl.current.isRegistered = false;
            };
            var error = function(response) {
                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});
            };

            HackathonParticipants.delete(data, success, error);
        };

        // Delete the hackathon
        ctrl.delete = function() {
            messageCenterService.reset();

            var success = function(response) {
                messageCenterService.add('success', response.message, { status: messageCenterService.status.next });
                $state.go('hackathons');
            };

            Hackathon.delete({hid: $stateParams.hackathonId}, success);
        };

    });