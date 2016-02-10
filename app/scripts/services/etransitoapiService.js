'use strict';
/**
 * @ngdoc function
 * @name Etransitocidadao.service:API
 * @description
 * # API
 */
angular.module('Etransitocidadao').factory("API", function($http, $q, API_ENDPOINT) {
    var api = {};
    api.ipva = function(params) {
        var deffered = $q.defer();
        $http({
            method: 'GET',
            url: API_ENDPOINT.host + '/ipva/servico?r=' + params.r + '&c=' + params.c + '&p=' + params.p + '&d=' + params.d,
            cache: false
        }).success(function(data) {
            if (data.status === true) {
                deffered.resolve({
                    status: 200,
                    results: data
                });
            } else {
                deffered.resolve({
                    status: 204,
                    results: data
                });
            }
            api.results = data;
        }).error(function() {
            deffered.resolve({
                status: 500
            });
        });
        return deffered.promise;
    };
    return api;
});
