'use strict';

(function () {
    angular.module('myApp.user.browse', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('user.browse', {
                                url: "/all",
                                controller: "BrowseUserCtrl",
                                templateUrl: '/partials/user/browse/browse.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])
            .filter('enabledFilter', function () {
                return function (value) {
                    return value ? "Yes" : "No"
                }
            })
            .controller('BrowseUserCtrl', ["$scope", "$http", "uiGridConstants", "userService", "$interval", "$rootScope", "$state", function ($scope, $http, uiGridConstants, userService, $interval, $rootScope, $state) {

                    var init = true;
                    $('#spinner').show();
                    fetchUsers();
                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("home");
                        }
                    };
                    var actionTemplate = '<div class="ui-grid-cell-contents">' +
                            '<a class="label label-primary" uib-tooltip="View" tooltip-placement="left" ui-sref="user.show({id: row.entity.id})">' +
                            '<i class="fa fa-eye"></i>' +
                            '</a>&nbsp;' +
                            '<a class="label label-info" uib-tooltip="Edit" tooltip-placement="left" ui-sref="user.edit({id: row.entity.id})">' +
                            '<i class="fa fa-pencil"></i>' +
                            '</a>&nbsp;' +
                            '<a class="label label-warning" uib-tooltip="Change Password" tooltip-placement="left" ng-click="grid.appScope.change(row.entity.id)">' +
                            '<i class="fa fa-unlock-alt"></i>' +
                            '</a>&nbsp;' +
                            '<a href="" ng-if="row.entity.enabled" uib-tooltip="Disable" tooltip-placement="left" ng-click="grid.appScope.disable(row.entity.id)">' +
                            '<span ng-if="row.entity.enabled" class="label label-danger">' +
                            '<i class="fa fa-times"></i>' +
                            '</span>&nbsp;' +
                            '</a>' +
                            '<a href="" ng-if="!row.entity.enabled" uib-tooltip="Enable" tooltip-placement="left" ng-click="grid.appScope.disable(row.entity.id)">' +
                            '<span ng-if="!row.entity.enabled" class="label label-success">' +
                            '<i class="fa fa-check"></i>' +
                            '</span>&nbsp;' +
                            '</a>' +
                            '</div>';
                    $scope.gridOptions = {
                        data: 'users',
                        onRegisterApi: function (gridApi) {
                            $scope.gridApi = gridApi;
                        },
                        enableCellSelection: true,
                        enableFiltering: false,
                        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                        enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                        columnDefs: [
                            {field: "username", cellClass: 'text-left'},
                            {field: "last_name", cellClass: 'text-left'},
                            {field: "first_name", cellClass: 'text-left'},
                            {field: "email", cellClass: 'text-left'},
                            {field: "enabled", enableFiltering: false, cellFilter: "enabledFilter"},
                            {name: "Action", enableSorting: false, enableFiltering: false, enableHiding: false, cellTemplate: actionTemplate},
                        ]
                    };
                    $scope.toggleFiltering = function () {
                        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                    };
                    $scope.disable = function (id) {
                        $('#disableModal').modal('show');
                        $scope.id = id;
                    };
                    $scope.change = function (id) {
                        $scope.id = id;
                        $('#changePassModal').modal('show');
                        console.log(id);
                    }

                    $('#disableModal').on('hide.bs.modal', function () {
                        $scope.password = "";
                    });
                    $interval(fetchUsers, 3000);
                    $scope.confirm = function () {
                        $('#spinner').fadeIn(300);
                        $http.post(Routing.generate('password_match'), {password: $scope.password, id: $scope.id})
                                .then(function (response) {
                                    if (response.data.match) {
                                        var stat = response.data.enabled ? "enabled" : "disabled";
                                        var n = noty({
                                            text: "Admin successfully " + stat,
                                            type: 'success',
                                            layout: 'topRight',
                                            animation: {
                                                open: 'animated bounceIn', // Animate.css class names
                                                close: 'animated bounceOut', // Animate.css class names
                                            },
                                            timeout: 5000
                                        });
                                    } else {
                                        var n = noty({
                                            text: "Invalid password",
                                            type: 'error',
                                            layout: 'topRight',
                                            animation: {
                                                open: 'animated bounceIn', // Animate.css class names
                                                close: 'animated bounceOut', // Animate.css class names
                                            },
                                            timeout: 5000
                                        });
                                    }

                                    $('#spinner').fadeOut(300);
                                });
                        $('#disableModal').modal('hide');
                    };
                    $scope.changePass = function () {
                        if ($scope.newPassword == "" || $scope.confirmPassword == "") {
                            var n = noty({
                                text: "Please fill in all fields",
                                type: 'error',
                                layout: 'topRight',
                                animation: {
                                    open: 'animated bounceIn', // Animate.css class names
                                    close: 'animated bounceOut', // Animate.css class names
                                },
                                timeout: 5000
                            });
                        } else {
                            if ($scope.newPassword != $scope.confirmPassword) {
                                var n = noty({
                                    text: "Passwords don't match",
                                    type: 'error',
                                    layout: 'topRight',
                                    animation: {
                                        open: 'animated bounceIn', // Animate.css class names
                                        close: 'animated bounceOut', // Animate.css class names
                                    },
                                    timeout: 5000
                                });
                            } else {
                                $('#spinner').fadeIn(300);
                                $http.post(Routing.generate('user_changepass'), {id: $scope.id, pass: $scope.newPassword, conPass: $scope.confirmPassword})
                                        .then(
                                                function (response) {
                                                    $('#spinner').fadeOut(300);
                                                    var changed = response.data.changed;
                                                    if (changed) {
                                                        var n = noty({
                                                            text: "Password successfully changed",
                                                            type: 'success',
                                                            layout: 'topRight',
                                                            animation: {
                                                                open: 'animated bounceIn', // Animate.css class names
                                                                close: 'animated bounceOut', // Animate.css class names
                                                            },
                                                            timeout: 5000
                                                        });
                                                    } else {
                                                        var n = noty({
                                                            text: "Change password failed",
                                                            type: 'error',
                                                            layout: 'topRight',
                                                            animation: {
                                                                open: 'animated bounceIn', // Animate.css class names
                                                                close: 'animated bounceOut', // Animate.css class names
                                                            },
                                                            timeout: 5000
                                                        });
                                                    }
                                                }
                                        );
                                $('#changePassModal').modal('hide');
                                $scope.newPassword = "";
                                $scope.confirmPassword = "";
                            }
                        }
                    }


                    function fetchUsers() {

                        if (init) {
                            $('#spinner').fadeIn(300);
                        }

                        var success = function (response) {
                            $scope.users = response.data.users;
                            $('#spinner').fadeOut(300);
                        };
                        var error = function (reason) {
                            $scope.error = "Failed to fetch encoders";
                            $('#spinner').fadeOut(300);
                        };
                        init = false;
                        userService.getUsers(success, error);
                    }
                }
            ]);
}());




