'use strict';
/**
 * @ngdoc function
 * @name Etransitocidadao.controller:ipvaController
 * @description
 * # ipvaController
 */
angular.module('Etransitocidadao')
    .controller('ipvaController', function($scope, $rootScope, $location, $localstorage, API, Alerts, $ionicLoading) {
        $scope.query = {}

        $rootScope.buscar = function(q, flag) {
            var vf = vform("form#search");
            if (vf.status) {
                $ionicLoading.show({
                    template: 'Processando... Aguarde!'
                });
                if (flag) {
                    q.d = createDate(null);
                }
                q.c = q.c.replace(/\D/g, "");
                console.log(q);
                API.ipva(q).then(function(res) {
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
                                    Alerts.default($scope, "Ops. Que chato!", "Desculpe-nos, mas os serviços da <a href='https://app.sefa.pa.gov.br/'>SEFA-PA</a> estão fora do ar. Não somos respnsáveis por isso. mas sentimos muito por você.", "Ok", function() {});
                                }
                            }
                        }
                    } catch (e) {}
                });
            } else {
                Alerts.default($scope, "Ops! Atenção", vf.template, "Ok", function() {});
            }
        };

        $scope.msg = "Após o preenchimento correto das informações, nossos sistemas irão consultar a SEFA-PA através do seu portal de serviços: https://app.sefa.pa.gov.br/servicosipva \n O tempo de resposta, assim como o conteúdo depende totalmente da disponibilidade do Portal de Serviços.";
        $scope.info_active = false;
        /**/
        $scope.showinfo = function() {
            $scope.info_active = true;
        };

        $scope.msghistory = "Os dados de histórico de busca são armazenados apenas localmente no seu dispositivo, sua limpeza não interfere em nada no serviço oferecido.";
        $scope.info_active_history = false;
        /**/
        $scope.showinfohistory = function() {
            $scope.info_active_history = true;
        };
        $scope.goHistory = function() {
            $location.path('app/ipvahistory');
        };
    });
