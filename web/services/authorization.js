'use strict';

(function () {
    angular.module('myApp.service.authorization', [])
            .service('authorization', ['$http', '$rootScope', '$state', 'principal', function ($http, $rootScope, $state, principal) {

//
//                    this.isAuthorized = function () {
//                        var required = $rootScope.toState.data.roles;
//                        var id = required.indexOf("OWNER") != -1 ? $rootScope.toParams.id : 0;
//
//                        return $http.post(Routing.generate('is_authorized'), {roles: required, id: id});
//
//                    };
//                    this.isAuthenticated = function () {
//                        return $http.get(Routing.generate('is_authenticated'))
//                    };

                    this.authorize = function () {
                        return principal.identity()
                                .then(function () {
                                    var isAuthenticated = principal.isAuthenticated();
                                    
                                    if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
                                        if (isAuthenticated)
                                            $state.go('home');
                                        else {
                                            window.location.href = Routing.generate('fos_user_security_login');
                                        }
                                    }
                                });
                    };
                }]);
}());