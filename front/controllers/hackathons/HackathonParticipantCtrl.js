(function() {


    /**
     * Hackathon Controller. Available in hackathon pages.
     */
    app.controller('HackathonParticipantCtrl', function($rootScope, $http, $state, messageCenterService, $stateParams) {
        var ctrl = this;

        // Participants which are currently loaded
        ctrl.participants = {};

        ctrl.loadParticipants();

        // Load data for the participant page.
        ctrl.loadParticipants = function() {
            ctrl.id = $stateParams.hackathonId;
            $http.get(api('hackathons_get_users').format([$stateParams.hackathonId]), {}).then(function(response) {
                ctrl.participants = response.data;
            }, function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            });
        };

        // Add a registration of a user in an hackathon.
        ctrl.register = function(userID) {
            messageCenterService.reset();

            var data = {};
            if (userID) {
                data.user_id = userID;
            } else {
                if ($rootScope.currentUser)
                    data.user_id = $rootScope.currentUser.id;
            }

            $http.post(api('hackathons_add_user').format([$stateParams.hackathonId]), data).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                ctrl.current.nbParticipants += 1;
                ctrl.current.isRegistered = true;

                if (userID) {
                    ctrl.loadParticipants();
                }
            }, function(response) {
                if (response.data.user_id)
                    messageCenterService.add('danger', response.data.user_id[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});
            });
        };

        // Cancel the registration of a user.
        ctrl.cancelRegistration = function(participant) {
            messageCenterService.reset();

            if (participant) {
                user_id = participant.id;
            } else {
                user_id = $rootScope.currentUser.id;
            }

            $http.delete(api('hackathons_remove_user').format([$stateParams.hackathonId, user_id]), {}).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                ctrl.current.nbParticipants -= 1;
                ctrl.current.isRegistered = false;

                if (participant) {
                    var index = ctrl.participants.indexOf(participant);
                    ctrl.participants.splice(index, 1);
                }
            }, function(response) {
                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});
            });
        };

        // Confirm the presence of user in the hackathon.
        ctrl.attending = function(participant, status) {
            messageCenterService.reset();

            var data = {
                attending: status
            };

            $http.put(api('hackathons_update_user').format([$stateParams.hackathonId, participant.id]), data).then(function(response) {
                messageCenterService.add('success', response.data.message, {});
                participant.pivot.attending = status;
            }, function(response) {
                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});
            });
        };

    });

});