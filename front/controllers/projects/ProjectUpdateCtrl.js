    /**
     * Organization Controller. Available in organization pages.
     */
    app.controller('ProjectUpdateCtrl', function($scope, $rootScope, $http, $state, $stateParams, messageCenterService, form, Project) {
        var ctrl = this;

        // Organization which is currently updated
        ctrl.current = {};
        ctrl.dataLoading = false;

        // Load the data for a form (edit / members edit)
        ctrl.loadData = function() {
            if ($stateParams.projectId != null) {

                var success = function(response) {
                    ctrl.current = response.data;
                    ctrl.current.private_section = response.private_section;
                    if (response.data.admin_id != $rootScope.currentUser.id)
                        $state.go('hackathons_projects', {hackathonId: $stateParams.hackathonId});
                };
                var error = function (response) {
                    $state.go('hackathons_projects', {hackathonId: $stateParams.hackathonId});
                };

                Project.get({hid: $stateParams.hackathonId, pid: $stateParams.projectId}, success, error);
            }
            ctrl.hackathon_id = $stateParams.hackathonId;
        };
        ctrl.loadData();

        // Save data when the organization is created or edited
        ctrl.save = function(orga) {
            ctrl.dataLoading = true;
            messageCenterService.reset();

            var data = {};
            data._hid = $stateParams.hackathonId;
            form.populate($scope.form, data);

            var success = function(response) {
                messageCenterService.add('success', response.message, { status: messageCenterService.status.next });
                $state.go('hackathons_projects', {hackathonId: $stateParams.hackathonId});
            };
            var error = function(response) {
                if (response.data.name)
                    messageCenterService.add('danger', response.data.name[0], {});

                if (response.data.description)
                    messageCenterService.add('danger', response.data.description[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                if (typeof response.data === 'string' || response.data instanceof String)
                    messageCenterService.add('danger', response.data, {});

                $("body").scrollTop(0);
                ctrl.dataLoading = false;
            };

            // If null => create case, else edit case
            if ($stateParams.projectId != null) {
                data._pid = $stateParams.projectId;
                Project.update(data, success, error);
            } else {
                Project.save(data, success, error);
            }
        };

    });
