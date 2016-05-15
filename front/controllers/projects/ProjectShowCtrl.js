    /**
     * Organization Controller. Available in organization pages.
     */
    app.controller('ProjectShowCtrl', function($scope, $rootScope, $http, $state, $stateParams, messageCenterService, form, Project, ProjectMembers, Hackathon) {
        var ctrl = this;

        // Project which is currently updated
        ctrl.current = {};

        ctrl.loadHackathonData = function(callback) {
            var success = function(response) {
                ctrl.hackathon = response;
            };
            var error = function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            };

            Hackathon.get({hid: $stateParams.hackathonId}, success, error);
        };

        // Load the data for a form (edit / members edit)
        ctrl.loadData = function() {
            ctrl.loadHackathonData();

            var success = function(response) {
                ctrl.current.data = response.data;
                ctrl.userProject = response.user_project;
                ctrl.current.isAdmin = (response.data.admin_id == $rootScope.currentUser.id);
            };
            var error = function (response) {
                $state.go('hackathons_projects', {hackathonId: $stateParams.hackathonId});
            };

            ctrl.hackathon_id = $stateParams.hackathonId;
            ctrl.current = {};
            Project.get({hid: $stateParams.hackathonId, pid: $stateParams.projectId}, success, error);
            ctrl.current.members = ProjectMembers.search({hid: $stateParams.hackathonId, pid: $stateParams.projectId});
        };
        ctrl.loadData();

        // Add a user to a project
        ctrl.add = function() {
            messageCenterService.reset();

            var data = {
                _hid: $stateParams.hackathonId,
                _pid: $stateParams.projectId
            };

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                ctrl.userProject = {
                    id: $stateParams.projectId,
                    pivot: {}
                };
            };
            var error = function(response) {
                if (typeof response.data === 'string' || response.data instanceof String)
                    messageCenterService.add('danger', response.data, {});
            };

            ProjectMembers.save(data, success, error);
        };

        // Remove a user from a project
        ctrl.remove = function() {
            messageCenterService.reset();

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                ctrl.userProject = null;
            };

            ProjectMembers.delete({hid: $stateParams.hackathonId, pid: $stateParams.projectId, uid: $rootScope.currentUser.id}, success);
        };

        // Remove a user from a project
        ctrl.removeUser = function(member) {
            messageCenterService.reset();

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                $rootScope.arrayRemove(ctrl.current.members, member);
            };

            ProjectMembers.delete({hid: $stateParams.hackathonId, pid: $stateParams.projectId, uid: member.id}, success);
        };

        // Confirm the presence of user in the hackathon.
        ctrl.validate = function(member, status) {
            messageCenterService.reset();

            var data = {
                _hid: $stateParams.hackathonId,
                _pid: $stateParams.projectId,
                _uid: member.id,
                validate: status
            };

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                member.pivot.validate = status;
            };
            var error = function(response) {
                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});
            };

            ProjectMembers.update(data, success, error);
        };

        // Remove a user from a project
        ctrl.delete = function() {
            messageCenterService.reset();

            var success = function(response) {
                messageCenterService.add('success', response.message, { status: messageCenterService.status.next });
                $state.go('hackathons_projects', {hackathonId: $stateParams.hackathonId});
            };

            Project.delete({hid: project.hackathon_id, pid: $stateParams.projectId}, success);
        };

    });
