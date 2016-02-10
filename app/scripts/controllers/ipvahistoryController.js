'use strict';

/**
 * @ngdoc function
 * @name Etransitocidadao.controller:ipvahistoryController
 * @description
 * # ipvahistoryController
 */
angular.module('Etransitocidadao')
    .controller('ipvahistoryController', function($scope, $rootScope, $ionicLoading, $localstorage, $location, API, Alerts) {
        $scope.msghistory = "Os dados de histórico de busca são armazenados apenas localmente no seu dispositivo, sua limpeza não interfere em nada no serviço oferecido.";
        $scope.info_active_history = false;
        /**/
        /**/
        $scope.showinfohistory = function() {
            $scope.info_active_history = true;
        };

        $scope.loadH = function() {
            $scope.h = $localstorage.getObject("h").dados !== undefined ? $localstorage.getObject("h") : {
                dados: []
            };
        };

        $rootScope.$on('reloadh', function(event, args) {
            $scope.loadH();
        });

        $scope.clearH = function() {
            Alerts.confirm($scope, "Atenção", "Você realmente deseja limpar o histórico?", [{
                text: '<b>Sim</b>',
                type: 'btn btn-green',
                onTap: function(e) {
                    $scope.h.dados = [];
                    $localstorage.setObject("h", $scope.h);
                }
            }, {
                text: 'Não'
            }]);

        };

        $scope.consultar = function(obj) {
            var query = {};
            query.c = obj.cpfCnpj;
            query.r = obj.renavam;
            query.p = obj.placa;
            // $rootScope.consultarVeiculo(query);
            $localstorage.setObject('ipvaresult', obj);
            $rootScope.$broadcast('consultaipvaresult');
            $location.path("app/ipvaresult");
        };
        $rootScope.insertHistory = function(obj) {
            var h = $localstorage.getObject("h").dados !== undefined ? $localstorage.getObject("h") : {
                dados: []
            };
            h.dados.push(obj);
            $localstorage.setObject("h", h);
            $rootScope.$broadcast('reloadh');
        };

    });
