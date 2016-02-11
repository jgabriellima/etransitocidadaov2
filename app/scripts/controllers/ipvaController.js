'use strict';
/**
 * @ngdoc function
 * @name Etransitocidadao.controller:ipvaController
 * @description
 * # ipvaController
 */
angular.module('Etransitocidadao')
    .controller('ipvaController', function($scope, $rootScope, $location, $localstorage, API, Alerts, $ionicLoading) {
        $scope.query = {};


        $rootScope.insertHistory = function(obj) {
            obj.dtcreate = new Date();
            var h = $localstorage.getObject("h").dados !== undefined ? $localstorage.getObject("h") : {
                dados: []
            };
            h.dados.push(obj);
            try {
                $localstorage.setObject("h", h);
            } catch (E) {}
            $rootScope.$broadcast('reloadh');
        };



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
                                    try {
                                        res.results.dae.codigobarra = res.results.dae.codigobarra.slice(0, 51);
                                    } catch (E) {}
                                    try {
                                        $localstorage.setObject('ipvaresult', res.results);
                                    } catch (E) {}
                                    $rootScope.insertHistory(res.results);
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

        $scope.goHistory = function() {
            $location.path('app/ipvahistory');
        };
    });
