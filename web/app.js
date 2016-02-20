'use strict';
(function () {
    var myApp = angular.module('myApp', [
        'ui.router',
        'ngAnimate',
        'ui.tinymce',
        'ui.bootstrap',
        'ui.grid',
        'ui.checkbox',
        'myApp.announcement',
        'myApp.user',
        'myApp.service.user',
        'myApp.service.authorization',
        'myApp.index',
        'myApp.service.principal',
        'ngIdle',
        'nya.bootstrap.select',
        'ngFileUpload'
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
            .config(["IdleProvider", "KeepaliveProvider", function (IdleProvider, KeepaliveProvider) {
                    IdleProvider.idle(180);
                    IdleProvider.timeout(180);
                }])
            .run(['$rootScope', 'authorization', 'principal', 'Idle', function ($rootScope, authorization, principal, Idle) {

                    $rootScope.$on('$stateChangeStart', function (e, toState, toParams) {
                        $rootScope.toState = toState;
                        $rootScope.toParams = toParams;

                        Idle.watch();

                        $rootScope.$on('IdleTimeout', function () {
                            window.location.href = Routing.generate('fos_user_security_logout');
                        });

                        if (principal.isIdentityResolved())
                            authorization.authorize();
                    });
                }])
            .controller("MainCtrl", ["$scope", "$rootScope", function ($scope, $rootScope) {
                    
                    $scope.id = $rootScope.id;

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


