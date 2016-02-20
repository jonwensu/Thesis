'use strict';

(function () {
    angular.module('myApp.user.browse', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('user.browse', {
                                url: "/all",
                                controller: "BrowseUserCtrl",
                                templateUrl: constants.viewPath() + 'user/browse/browse.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])

            .controller('BrowseUserCtrl', ["$scope", "$http", "uiGridConstants", "userService", "$interval", function ($scope, $http, uiGridConstants, userService, $interval) {

                    var init = true;

                    fetchUsers();

                    var actionTemplate = '<div class="ui-grid-cell-contents">' +
                            '<a class="label label-primary" title="View" ui-sref="user.show({id: row.entity.id})">' +
                            '<i class="fa fa-eye"></i>' +
                            '</a>&nbsp;' +
                            '<a class="label label-info" title="Edit" ui-sref="user.edit({id: row.entity.id})">' +
                            '<i class="fa fa-pencil"></i>' +
                            '</a>&nbsp;' +
                            '<a href="" title="Enable/Disable" ng-click="grid.appScope.disable(row.entity.id)">' +
                            '<span ng-if="row.entity.enabled" class="label label-danger">' +
                            '<i class="fa fa-times"></i>' +
                            '</span>' +
                            '<span ng-if="!row.entity.enabled" class="label label-success">' +
                            '<i class="fa fa-check"></i>' +
                            '</span>' +
                            '</a>' +
                            '</div>';
                    $scope.gridOptions = {
                        data: 'users',
                        onRegisterApi: function (gridApi) {
                            $scope.gridApi = gridApi;
                        },
                        enableCellSelection: true,
                        enableFiltering: false,
                        enableHorizontalScrollbar: 0,
                        enableVerticalScrollbar: 0,
                        columnDefs: [
                            {field: "username"},
                            {field: "last_name"},
                            {field: "first_name"},
                            {field: "email"},
                            {field: "enabled", enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents"><span ng-if="row.entity.enabled">Yes</span><span ng-if="!row.entity.enabled">No</span></div>'},
                            {name: "Action", enableSorting: false, enableFiltering: false, enableColumnHiding: false, cellTemplate: actionTemplate},
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
                                            timeout: 10000
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
                                            timeout: 10000
                                        });
                                    }

                                    $('#spinner').fadeOut(300);
                                });
                        $('#disableModal').modal('hide');
                    };


                    function fetchUsers() {

                        if (init) {
                            $('#spinner').fadeIn(300);
                        }

                        var success = function (response) {
                            $scope.users = response.data.users;
                            $('#spinner').fadeOut(300);
                        };
                        var error = function (reason) {
                            $scope.error = "Failed to fetch admins";
                            $('#spinner').fadeOut(300);
                        };
                        init = false;
                        userService.getUsers(success, error);

                    }
                }]);




}());




