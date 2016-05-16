    /**
     * Hackathon Controller. Available in hackathon pages.
     */
    app.controller('HackathonParticipantCtrl', function($rootScope, $http, $state, messageCenterService, $stateParams, HackathonParticipants) {
        var ctrl = this;

        // Participants which are currently loaded
        ctrl.participants = {};

        // Load data for the participant page.
        ctrl.loadParticipants = function() {
            ctrl.id = $stateParams.hackathonId;

            var success = function(response) {
                ctrl.participants = response;
            };
            var error = function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            };

            HackathonParticipants.get({hid: $stateParams.hackathonId}, success, error);
        };
        ctrl.loadParticipants();

        // Add a registration of a user in an hackathon.
        ctrl.register = function(userID) {
            messageCenterService.reset();

            var data = {
                _hid: $stateParams.hackathonId,
                user_id: userID
            };

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                ctrl.loadParticipants();
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
        ctrl.cancelRegistration = function(participant) {
            messageCenterService.reset();

            var data = {
                hid: $stateParams.hackathonId,
                uid: participant.id
            };

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                $rootScope.arrayRemove(ctrl.participants, participant);
            };
            var error = function(response) {
                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                if (typeof response.data === 'string' || response.data instanceof String)
                    messageCenterService.add('danger', response.data, {});
            };

            HackathonParticipants.delete(data, success, error);
        };

        // Confirm the presence of user in the hackathon.
        ctrl.attending = function(participant, status) {
            messageCenterService.reset();

            var data = {
                _hid: $stateParams.hackathonId,
                _uid: participant.id,
                attending: status
            };

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                participant.pivot.attending = status;
            };
            var error = function(response) {
                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                if (typeof response.data === 'string' || response.data instanceof String)
                    messageCenterService.add('danger', response.data, {});
            };

            HackathonParticipants.update(data, success, error);
        };

    });