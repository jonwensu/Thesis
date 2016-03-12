'use strict';
(function () {
    angular.module('myApp.college.browse', [])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('college.browse', {
                                url: "/browse",
                                controller: "BrowseCollegesCtrl",
                                templateUrl: constants.viewPath() + 'college/browse/browse.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])
            .controller('BrowseCollegesCtrl', ["$scope", "$http", "$state", "uiGridConstants", "$interval", "$rootScope", function ($scope, $http, $state, uiGridConstants, $interval, $rootScope) {

                    $('#spinner').show();

                    $scope.ready = false;


                    $http.get(Routing.generate("get_colleges"))
                            .then(function (response) {

                                $scope.colleges = response.data.colleges;
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

                    function  fetchColleges() {
                        $http.get(Routing.generate("get_colleges"))
                                .then(function (response) {
                                    $scope.colleges = response.data.colleges;
                                });
                    }
                    ;
                    $interval(fetchColleges, 3000);

                    $scope.toggleFiltering = function () {
                        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                    };
                    var actionTemplate = '<div class="ui-grid-cell-contents">' +
                            '<a class="label label-info" uib-tooltip="Edit" tooltip-placement="left" ui-sref="college.edit({id: row.entity.id})">' +
                            '<i class="fa fa-pencil"></i>' +
                            '</a>&nbsp;' +
                            '<a class="label label-danger" uib-tooltip="Delete" tooltip-placement="left" ng-click="grid.appScope.deleteCollege(row.entity.id)">' +
                            '<i class="fa fa-trash"></i>' +
                            '</a>' +
                            '</div>';


                    $scope.gridOptions = {
                        data: 'colleges',
                        onRegisterApi: function (gridApi) {
                            $scope.gridApi = gridApi;
                        },
                        enableCellSelection: true,
                        enableFiltering: false,
                        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                        enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                        columnDefs: [
                            {field: "name", cellClass: "text-left"},
                            {field: "departments.length", displayName: "Departments", enableHiding: false},
                            {name: "Action", enableSorting: false, enableFiltering: false, enableHiding: false, cellTemplate: actionTemplate},
                        ]
                    };


                    $scope.deleteCollege = function (id) {
                        if (_.findWhere($scope.colleges, {id: id}).departments.length > 0) {
                            var n = noty({
                                text: "College has departments under it therefore cannot be deleted",
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
                            $scope.collegeId = id;
                        }
                    };

                    $('#deleteModal').on('hide.bs.modal', function () {
                        $scope.password = "";
                    });

                    $scope.confirm = function () {
                        $('#spinner').fadeIn(300);


                        $http.post(Routing.generate('college_delete'), {password: $scope.password, id: $scope.collegeId})
                                .then(function (response) {
                                    if (response.data.match) {
                                        var n = noty({
                                            text: "College successfully deleted",
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


