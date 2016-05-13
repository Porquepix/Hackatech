(function() {


    /**
     * Hackathon Controller. Available in hackathon pages.
     */
    app.controller('HackathonShowCtrl', function($rootScope, $http, $state, messageCenterService, $stateParams) {
        var ctrl = this;

        // Hackathon which is currently loaded
        ctrl.current = {};

        ctrl.loadData();

        // Retrieve the class color of an hackathon. This class is used in index and view pages.
        ctrl.getColor = function(hackathon) {
            var classes = ['rgba-blue-strong', 'rgba-red-strong', 'rgba-pink-strong', 'rgba-purple-strong', 'rgba-indigo-strong', 'rgba-cyan-strong', 'rgba-green-strong', 'rgba-orange-strong'];
            var random = (hackathon.name.charCodeAt(0) + hackathon.name.charCodeAt(1) + hackathon.max_participant + hackathon.abstract.charCodeAt(0)) % classes.length;
            hackathon.color = classes[random];
        };

        // Load data about one hackathon which the id is in the url
        ctrl.loadData = function(callback) {
            if ($stateParams.hackathonId != null) {
                $http.get(api('hackathons_view').format([$stateParams.hackathonId]), {}).then(function(response) {
                    ctrl.current = response.data;

                    ctrl.current.data.beginning_std = ctrl.current.data.beginning.replace(/(.+) (.+)/, "$1T$2Z");
                    ctrl.current.data.beginning_std = new Date(ctrl.current.data.beginning_std);
                    ctrl.current.data.beginning_std.setHours(ctrl.current.data.beginning_std.getHours() - 1);

                    ctrl.current.data.ending_std = ctrl.current.data.ending.replace(/(.+) (.+)/, "$1T$2Z");
                    ctrl.current.data.ending_std = new Date(ctrl.current.data.ending_std);
                    ctrl.current.data.ending_std.setHours(ctrl.current.data.ending_std.getHours() - 1);

                    ctrl.getColor(ctrl.current.data);

                    if (callback)
                        callback();
                }, function(response) {
                    $state.go('hackathons');
                });
            }
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

        // Delete the hackathon
        ctrl.delete = function() {
            messageCenterService.reset();
            $http.delete(api('hackathons_delete').format([$stateParams.hackathonId]), {}).then(function(response) {
                messageCenterService.add('success', response.data.message, { status: messageCenterService.status.next });
                $state.go('hackathons');
            });
        };

    });

});