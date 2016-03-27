'use strict';
(function () {
    angular.module('myApp.faculty.browse', [])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('faculty.browse', {
                                url: "/browse",
                                controller: "BrowseFacultyCtrl",
                                templateUrl: '/partials/faculty/browse/browse.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])
            .controller('BrowseFacultyCtrl', ["$scope", "$http", "$state", "uiGridConstants", "$interval", "$rootScope", function ($scope, $http, $state, uiGridConstants, $interval, $rootScope) {

                    $('#spinner').show();

                    $scope.ready = false;


                    $http.get(Routing.generate("get_faculty_all_members"))
                            .then(function (response) {

                                $scope.faculty = response.data.faculty;
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

                    function  fetchFaculty() {
                        $http.get(Routing.generate("get_faculty_all_members"))
                                .then(function (response) {
                                    $scope.faculty = response.data.faculty;
                                });
                    }
                    ;
                    $interval(fetchFaculty, 3000);

                    $scope.toggleFiltering = function () {
                        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                    };
                    var actionTemplate = '<div class="ui-grid-cell-contents">' +
                            '<a class="label label-primary" uib-tooltip="View" tooltip-placement="left" ui-sref="faculty.show({id: row.entity.id})">' +
                            '<i class="fa fa-eye"></i>' +
                            '</a>&nbsp;' +
                            '<a class="label label-info" uib-tooltip="Edit" tooltip-placement="left" ui-sref="faculty.edit({id: row.entity.id})">' +
                            '<i class="fa fa-pencil"></i>' +
                            '</a>&nbsp;' +
                            '<a class="label label-danger" uib-tooltip="Delete" tooltip-placement="left" ng-click="grid.appScope.deleteFaculty(row.entity.id)">' +
                            '<i class="fa fa-trash"></i>' +
                            '</a>' +
                            '</div>';


                    $scope.gridOptions = {
                        data: 'faculty',
                        onRegisterApi: function (gridApi) {
                            $scope.gridApi = gridApi;
                        },
                        enableCellSelection: true,
                        enableFiltering: false,
                        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                        enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                        columnDefs: [
                            {field: "last_name", cellClass: "text-left", enableHiding: false },
                            {field: "first_name", cellClass: "text-left", enableHiding: false },
                            {field: "college", cellClass: "text-left", enableHiding: false},
                            {field: "department", cellClass: "text-left", enableHiding: false},
                            {name: "Action", enableSorting: false, enableFiltering: false, enableHiding: false, cellTemplate: actionTemplate},
                        ]
                    };


                    $scope.deleteFaculty = function (id) {
                        $('#deleteModal').modal('show');
                        $scope.facultyId = id;
                    };

                    $('#deleteModal').on('hide.bs.modal', function () {
                        $scope.password = "";
                    });

                    $scope.confirm = function () {
                        $('#spinner').fadeIn(300);


                        $http.post(Routing.generate('faculty_delete'), {password: $scope.password, id: $scope.facultyId})
                                .then(function (response) {
                                    if (response.data.match) {
                                        var n = noty({
                                            text: "Faculty member successfully deleted",
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


