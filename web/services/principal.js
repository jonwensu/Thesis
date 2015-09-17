'use strict';

(function () {
    angular.module('myApp.service.principal', [])
            .service('principal', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
                    var _identity = undefined,
                            _authenticated = false;

                    this.isIdentityResolved = function () {
                        return angular.isDefined(_identity);
                    };

                    this.isAuthenticated = function () {
                        return _authenticated;
                    };

                    this.isInRole = function (role) {
                        if (!_authenticated || !_identity.roles)
                            return false;
                        return _identity.roles.indexOf(role) != -1;
                    };

                    this.isInAnyRole = function (roles) {
                        if (!_authenticated || !_identity.roles)
                            return false;

                        if ($rootScope.toState.data.roles.indexOf("OWNER") != -1 && $rootScope.toParams.id == $rootScope.id)
                            return true;

                        for (var i = 0; i < roles.length; i++) {
                            if (this.isInRole("ROLE_" + roles[i]))
                                return true;
                        }
                        return false;
                    };

                    this.authenticate = function (identity) {
                        _identity = identity;
                        _authenticated = identity != null;
                    };

                    this.identity = function (force) {
                        var deferred = $q.defer();

                        if (force === true)
                            _identity = undefined;

                        if (angular.isDefined(_identity)) {
                            deferred.resolve(_identity);
                            return deferred.promise;
                        }


                        $http.get(Routing.generate("get_user_current"))
                                .then(function (response) {
                                    _identity = response.data;
                                    _authenticated = true;
                                    deferred.resolve(_identity);
                                    $rootScope.id = _identity.id;
                                }, function (reason) {
                                    _identity = null;
                                    _authenticated = false;
                                    deferred.resolve(_identity);
                                });
                        return deferred.promise;

                    };
                }])
}());