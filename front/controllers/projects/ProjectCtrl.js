    /**
     * ProjectCtrl
     */
    app.controller('ProjectCtrl', function(Project, $stateParams, $rootScope, Hackathon, messageCenterService, ProjectMembers, $state) {
        var ctrl = this;

        ctrl.projects = {}

        ctrl.loadHackathonData = function(callback) {
            var success = function(response) {
                ctrl.hackathon = response;
            };
            var error = function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            };

            Hackathon.get({hid: $stateParams.hackathonId}, success, error);
        };

        ctrl.init = function() {
            ctrl.loadHackathonData();

            var success = function(response) {
                ctrl.projects = response.data;
                ctrl.projects.forEach(function(e) {
                    e.isAdmin = (e.admin_id == $rootScope.currentUser.id);
                });
                ctrl.userProject = response.user_project;
            };
            var error = function (response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            };

            Project.search({hid: $stateParams.hackathonId}, success, error);
        }
        ctrl.init();

        // Add a user to a project
        ctrl.add = function(project) {
            messageCenterService.reset();

            var data = {
                _hid: $stateParams.hackathonId,
                _pid: project.id
            };

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                ctrl.userProject = {
                    id: project.id,
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
        ctrl.remove = function(project) {
            messageCenterService.reset();

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                ctrl.userProject = null;
            };

            ProjectMembers.delete({hid: $stateParams.hackathonId, pid: project.id, uid: $rootScope.currentUser.id}, success);
        };

        // Remove a user from a project
        ctrl.delete = function(project) {
            messageCenterService.reset();

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                $rootScope.arrayRemove(ctrl.projects, project);
                if (ctrl.userProject != null && project.id == ctrl.userProject.id) {
                    ctrl.userProject = null;
                }
            };

            Project.delete({hid: project.hackathon_id, pid: project.id}, success);
        };

    });