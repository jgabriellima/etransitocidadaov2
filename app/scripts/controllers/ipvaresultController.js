'use strict';
/**
 * @ngdoc function
 * @name Etransitocidadao.controller:ipvaresultController
 * @description
 * # ipvaresultController
 */
angular.module('Etransitocidadao')
    .controller('ipvaresultController', function($scope, $rootScope, API, $location, $localstorage, Alerts,
        $ionicLoading) {
        /**/
        $scope.q = {};
        $scope.init = function() {
            $scope.result = $localstorage.getObject('ipvaresult');
            $scope.debitos = true;
            try {
                if ($scope.result.debitos.length === 0) {
                    $scope.debitos = false;
                }
            } catch (e) {
                $scope.debitos = false;
            }
            /*console.log("init ", $scope.debitos, $scope.result);*/
        };

        $rootScope.$on('consultaipvaresult', function(event, args) {
            $scope.init();
        });

        $scope.novaconsulta = function() {
            var query = {};
            query.c = $scope.result.cpfCnpj;
            query.r = $scope.result.renavam;
            query.p = $scope.result.placa;
            query.d = createDate($scope.q.novadata);
            $ionicLoading.show({
                template: 'Processando... Aguarde!'
            });
            API.ipva(query).then(function(res) {
                $ionicLoading.hide();
                try {
                    if (res.status !== 500) {
                        if (res.status === 204) {
                            Alerts.default($scope, "Ops!", res.results.msg, "Ok", function() {});
                        } else {
                            if (sefaVerification(res.results)) {
                                $localstorage.setObject('ipvaresult', res.results);
                                $rootScope.$broadcast('consultaipvaresult');
                                $location.path("app/ipvaresult");
                            } else {
                                Alerts.default($scope, "Ops. Que chato!", "Desculpe-nos, mas os serviços da <a href='https://app.sefa.pa.gov.br/'>SEFA-PA</a> estão fora do ar. Não somos respnsáveis por isso, mas sentimos muito por você.", "Ok", function() {});
                            }
                        }
                    }
                } catch (e) {
                    Alerts.default($scope, "Ops. Que chato!", "Ocorreu um erro ao tentarmos realizar esta consulta. Por favor, tente novamente!", "Ok", function() {});
                }
            });
        };
        $scope.copiarcodigobarras = function() {
            $cordovaClipboard
                .copy($scope.result.dae.codigobarra)
                .then(function() {
                    Alerts.default($scope, "Sucesso!", "Código de barras copiado com sucesso!", "Ok", function() {});
                }, function() {
                });
        }
    });
