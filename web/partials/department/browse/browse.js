'use strict';
(function () {
    angular.module('myApp.department.browse', [])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('department.browse', {
                                url: "/browse",
                                controller: "BrowseDepartmentsCtrl",
                                templateUrl: constants.viewPath() + 'department/browse/browse.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])
            .controller('BrowseDepartmentsCtrl', ["$scope", "$http", "$state", "uiGridConstants", "$interval", "$rootScope", function ($scope, $http, $state, uiGridConstants, $interval, $rootScope) {

                    $('#spinner').show();

                    $scope.ready = false;


                    $http.get(Routing.generate("get_departments"))
                            .then(function (response) {

                                $scope.departments = response.data.departments;
                                $scope.ready = true;

                                $('#spinner').fadeOut(500);
                            });


                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("home");
                        }
                    };

                    function  fetchDepartments() {
                        $http.get(Routing.generate("get_departments"))
                                .then(function (response) {
                                    $scope.departments = response.data.departments;
                                });
                    }
                    ;
                    $interval(fetchDepartments, 3000);

                    $scope.toggleFiltering = function () {
                        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                    };
                    var actionTemplate = '<div class="ui-grid-cell-contents">' +
                            '<a class="label label-info" uib-tooltip="Edit" tooltip-placement="left" ui-sref="department.edit({id: row.entity.id})">' +
                            '<i class="fa fa-pencil"></i>' +
                            '</a>&nbsp;' +
                            '<a class="label label-danger" uib-tooltip="Delete" tooltip-placement="left" ng-click="grid.appScope.deleteDepartment(row.entity.id)">' +
                            '<i class="fa fa-trash"></i>' +
                            '</a>' +
                            '</div>';


                    $scope.gridOptions = {
                        data: 'departments',
                        onRegisterApi: function (gridApi) {
                            $scope.gridApi = gridApi;
                        },
                        enableCellSelection: true,
                        enableFiltering: false,
                        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                        enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                        columnDefs: [
                            {field: "name", cellClass: "text-left"},
                            {field: "college.name", displayName: "College", cellClass: "text-left", enableHiding: false},
                            {field: "faculty.length", displayName: "Faculty Members", enableHiding: false},
                            {name: "Action", enableSorting: false, enableFiltering: false, enableHiding: false, cellTemplate: actionTemplate},
                        ]
                    };


                    $scope.deleteDepartment = function (id) {
                        if (_.findWhere($scope.departments, {id: id}).faculty.length > 0) {
                            var n = noty({
                                text: "Department has faculty members under it therefore cannot be deleted",
                                type: 'error',
                                layout: 'topRight',
                                animation: {
                                    open: 'animated bounceIn',
                                    close: 'animated bounceOut',
                                },
                                timeout: 10000
                            });
                        } else {
                            $('#deleteModal').modal('show');
                            $scope.departmentId = id;
                        }
                    };

                    $('#deleteModal').on('hide.bs.modal', function () {
                        $scope.password = "";
                    });

                    $scope.confirm = function () {
                        $('#spinner').fadeIn(300);


                        $http.post(Routing.generate('department_delete'), {password: $scope.password, id: $scope.departmentId})
                                .then(function (response) {
                                    if (response.data.match) {
                                        var n = noty({
                                            text: "Department successfully deleted",
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
                        $('#deleteModal').modal('hide');
                    };

                }]);
}());


