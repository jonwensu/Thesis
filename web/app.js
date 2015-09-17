'use strict';
(function () {
    var myApp = angular.module('myApp', [
        'ui.router',
        'ngAnimate',
        'ui.tinymce',
        'ui.bootstrap',
        'ui.grid',
        'myApp.announcement',
        'myApp.user',
        'myApp.directive.compareTo',
        'myApp.service.user',
        'myApp.service.authorization',
        'myApp.index',
        'myApp.service.principal'
    ])
            .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

                    $urlRouterProvider.otherwise("/");
                    $stateProvider.state('home', {
                        url: "/",
                        controller: "MainCtrl",
                        parent: 'index',
                        templateUrl: constants.viewPath() + "index.html",
                        data: {
                            roles: ["ADMIN"]
                        }
                    });
                }])
            .config(['$httpProvider', function ($httpProvider) {
                    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
                }])
            .run(['$rootScope', '$state', 'authorization', 'principal', function ($rootScope, $state, authorization, principal) {

                    $rootScope.$on('$stateChangeStart', function (e, toState, toParams) {
                        $rootScope.toState = toState;
                        $rootScope.toParams = toParams;

                        if (principal.isIdentityResolved())
                            authorization.authorize();

//                        var authenSuccess = function (response) {
//                            var authenticated = response.data.authenticated;
//                            if (!authenticated) {
//                                window.location.href = Routing.generate("fos_user_security_login");
//                            }
//                        };
//
//                        var authenError = function (reason) {
//                            window.location.href = Routing.generate("fos_user_security_login");
//                        }
//
//                        var authorSuccess = function (response) {
//                            var authorized = response.data.authorized;
//                            if (!authorized) {
//                                $state.go("home");
//                            }
//                        };
//
//                        var authorError = function (reason) {
//                            $state.go("home");
//                        }
//
//                        authorization.isAuthenticated().then(authenSuccess, authenError);
//                        authorization.isAuthorized().then(authorSuccess, authorError);


                    });
                }])
            .controller("MainCtrl", ["$scope", function ($scope) {

                    $('.btn-minimize').click(function (e) {
                        e.preventDefault();
                        var $target = $(this).parent().parent().next('.box-content');
                        if ($target.is(':visible'))
                            $('i', $(this)).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                        else
                            $('i', $(this)).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                        $target.slideToggle();
                    });
                }])
}());


