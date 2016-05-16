    app.controller('HackathonUpdateCtrl', function($scope, $rootScope, $http, $state, messageCenterService, form, $stateParams, Hackathon, MyOrganization, dateStdFormater) {
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
                var success = function(response) {
                    ctrl.current = response;

                    callback();

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

        // Load the organisation of the current user, to do a select html list 
        ctrl.loadOrgas = function() {
            var success = function(response) {
                ctrl.orgas = response.admin;
            };
            MyOrganization.get({uid: $rootScope.currentUser.id}, success);
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

            ctrl.loadOrgas();
        };
        ctrl.loadFormData();

        // Save an hackathon (create or edit).
        ctrl.save = function(hackathon) {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {};
            form.populate($scope.form, data);

            var success = function(response) {
                messageCenterService.add('success', response.message, { status: messageCenterService.status.next });
                $state.go('my_hackathons', {'#': 'as-organizer'});
            };
            var error = function(response) {
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

                if (typeof response.data === 'string' || response.data instanceof String)
                    messageCenterService.add('danger', response.data, {});

                ctrl.dataLoading = false;
                $("body").scrollTop(0);
            };

            // If null => create case, else edit case
            if ($stateParams.hackathonId != null) {
                data._hid = $stateParams.hackathonId;
                Hackathon.update(data, success, error);
            } else {
                Hackathon.save(data, success, error);
            }
        };

    });