    app.controller('ProjectCtrl', function(Project, $stateParams, $rootScope, Hackathon, messageCenterService, ProjectMembers, $state, Vote, $scope, form) {
        var ctrl = this;

        // All the projects of an hackathon
        ctrl.projects = {}

        // Load the data about the hackathon
        ctrl.loadHackathonData = function() {
            var success = function(response) {
                ctrl.hackathon = response;
            };
            var error = function(response) {
                $state.go('hackathons_view', {hackathonId: $stateParams.hackathonId});
            };

            Hackathon.get({hid: $stateParams.hackathonId}, success, error);
        };

        // Load the data about all the projects of an hackathon
        ctrl.init = function() {
            ctrl.loadHackathonData();

            var success = function(response) {
                ctrl.projects = response.data;
                ctrl.projects.forEach(function(e) {
                    e.isAdmin = (e.admin_id == $rootScope.currentUser.id);
                    e.alreadyVoted = (e.voting.length > 0);
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
                    pivot: {
                       project_id: $stateParams.projectId
                    }
                };
            };
            var error = function(response) {
                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

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

        // Save (create / update) a mark for a project
        ctrl.vote = function(project) {
            messageCenterService.reset();

            var data = {
                pid: project.id,
                hid: $stateParams.hackathonId,
                mark: project.voting[0].pivot.mark
            };

            var success = function(response) {
                messageCenterService.add('success', response.message, {});
                project.alreadyVoted = true;
            };
            var error = function(response) {
                if (response.data.mark)
                    messageCenterService.add('danger', response.data.mark[0], {});

                if (response.data.error)
                    messageCenterService.add('danger', response.data.error, {});

                if (typeof response.data === 'string' || response.data instanceof String)
                    messageCenterService.add('danger', response.data, {});
            };

            if (project.alreadyVoted) {
                Vote.update(data, success, error);
            } else {
                Vote.save(data, success, error);
            }
        };

    });