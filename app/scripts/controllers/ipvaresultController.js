'use strict';
/**
 * @ngdoc function
 * @name Etransitocidadao.controller:ipvaresultController
 * @description
 * # ipvaresultController
 */
angular.module('Etransitocidadao')
    .controller('ipvaresultController', function($scope, $rootScope, $cordovaSocialSharing, $cordovaClipboard,
        API, $location, $localstorage, Alerts, $ionicLoading) {
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
            try {
                $scope.result.dtcreate = new Date();
                $rootScope.insertHistory($scope.result);
            } catch (e) {}
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
                }, function() {});
        };
        $scope.enviarcodigobarras = function() {
            $cordovaSocialSharing
                .share("eTrânsitoCidadão\n\n Proprietário: " + $scope.result.Proprietario + "\nPlaca: " + $scope.result.placa + "\n RENAVAM: " + $scope.result.renavam + "\n Código de Barras para pagamento: " + $scope.result.dae.codigobarra + "\n\n eTrânsitoCidadão :: Huddle3", "eTrânsitoCidadão - Código de Barras para Pagamento - Placa: " + $scope.result.placa, [], "")
                .then(function(result) {
                    // Alerts.default($scope, "Sucesso!", "Código de barras enviado com sucesso!", "Ok", function() {});
                }, function(err) {
                    Alerts.default($scope, "Ops!", "Não foi possível enviar o código de barras!", "Ok", function() {});
                });
        };
    });
