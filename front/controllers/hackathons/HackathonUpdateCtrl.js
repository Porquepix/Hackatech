    /**
     * Hackathon Controller. Available in hackathon pages.
     */
    app.controller('HackathonUpdateCtrl', function($scope, $rootScope, $http, $state, messageCenterService, form, $stateParams) {
        var ctrl = this;

        // Hackathon which is currently loaded
        ctrl.current = {};

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

        // Load data for the create / edit form.
        ctrl.loadFormData = function() {
            if (!$rootScope.currentUser) {
                $state.go('login');
            }

            if ($stateParams.hackathonId != null) {
                ctrl.id = $stateParams.hackathonId;
                ctrl.loadData(function() {
                    if (!ctrl.current.isAdmin) {
                        $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
                    }

                    ctrl.current.data.orga = parseInt(ctrl.current.data.organization_id);
                });
            }


            $http.get(api('user_organizations').format([$rootScope.currentUser.id]), {}).then(function(response) {
                ctrl.orgas = response.data.admin;
            });
        };
        ctrl.loadFormData();

        // Save an hackathon (create or edit).
        ctrl.save = function(hackathonID) {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {};
            form.populate($scope.form, data);

            var succesCallback = function(response) {
                messageCenterService.add('success', response.data.message, {});
                ctrl.dataLoading = false;
                $("body").scrollTop(0);
            };
            var errorCallback = function(response) {
                if (response.data.name)
                    messageCenterService.add('danger', response.data.name[0], {});

                if (response.data.abstract)
                    messageCenterService.add('danger', response.data.abstract[0], {});

                if (response.data.description)
                    messageCenterService.add('danger', response.data.description[0], {});

                if (response.data.max_participant)
                    messageCenterService.add('danger', response.data.max_participant[0], {});

                if (response.data.max_participant_per_team)
                    messageCenterService.add('danger', response.data.max_participant_per_team[0], {});

                if (response.data.place_adr)
                    messageCenterService.add('danger', response.data.place_adr[0], {});

                if (response.data.beginning)
                    messageCenterService.add('danger', response.data.beginning[0], {});

                if (response.data.ending)
                    messageCenterService.add('danger', response.data.ending[0], {});

                if (response.data.organization_id)
                    messageCenterService.add('danger', response.data.organization_id[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                ctrl.dataLoading = false;
                $("body").scrollTop(0);
            };

            // If null => create case, else edit case
            if ($stateParams.hackathonId != null) {
                $http.put(api('hackathons_edit').format([hackathonID]), data).then(succesCallback, errorCallback);
            } else {
                $http.post(api('hackathons_create'), data).then(succesCallback, errorCallback);
            }
        };

    });