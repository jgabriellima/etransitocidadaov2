'use strict';
/**
 * @ngdoc function
 * @name Etransitocidadao.controller:meusveiculosController
 * @description
 * # meusveiculosController
 */
angular.module('Etransitocidadao')
    .controller('meusveiculosController', function($scope, $rootScope, $ionicLoading, $localstorage, $location, API, Alerts) {
        $scope.msg = "Clique em (+) para adicionar um novo veículo.\n Você será direcinado para o formulário de cadastro. Preencha-o corretamente para que suas consultas sejam efetuadas com sucesso.";
        $scope.info_active = false;
        $scope.query = {};
        /**/
        $scope.showinfo = function() {
            $scope.info_active = true;
        };
        $scope.goAdd = function() {
            $location.path('app/meusveiculos_form');
        };
        $rootScope.consultarVeiculo = function(query) {
            $ionicLoading.show({
                template: 'Processando... Aguarde!'
            });
            query.d = createDate(null);
            query.c = query.c.replace(/\D/g, "");
            console.log(query);
            API.ipva(query).then(function(res) {
                $ionicLoading.hide();
                try {
                    if (res.status !== 500) {
                        if (res.status === 204) {
                            Alerts.default($scope, "Ops!", res.results.msg, "Ok", function() {});
                        } else {
                            if (sefaVerification(res.results)) {
                                $localstorage.setObject('ipvaresult', res.results);
                                $location.path("app/ipvaresult");
                            } else {
                                Alerts.default($scope, "Ops. Que chato!", "Desculpe-nos, mas os serviços da <a href='https://app.sefa.pa.gov.br/'>SEFA-PA</a> estão fora do ar. Não somos respnsáveis por isso. mas sentimos muito por você.", "Ok", function() {});
                            }
                        }
                    }
                } catch (e) {}
            });
        };

        $scope.load = function() {
            $scope.meusveiculos = $localstorage.getObject("meusveiculos").dados !== undefined ? $localstorage.getObject("meusveiculos") : {
                dados: []
            };
        };

        $rootScope.$on('reloadmeusveiculos', function(event, args) {
            $scope.load();
        });

        /**/
        $scope.salvar = function() {
            var vf = vform("form#formveiculo");
            if (vf.status) {
                $scope.insertDB($scope.query);
                $scope.query = {};
                $location.path('app/meusveiculos');
            } else {
                Alerts.default($scope, "Ops! Atenção", vf.template, "Ok", function() {});
            }
        };

        $scope.insertDB = function(obj) {
            $scope.meusveiculos = $localstorage.getObject("meusveiculos").dados !== undefined ? $localstorage.getObject("meusveiculos") : {
                dados: []
            };
            $scope.meusveiculos.dados.push(obj);
            $localstorage.setObject("meusveiculos", $scope.meusveiculos);
            $rootScope.$broadcast('reloadmeusveiculos');
        };

        $scope.remove = function(index) {
            Alerts.confirm($scope, "Atenção", "Você realmente deseja excluir este registro?", [{
                text: '<b>Sim</b>',
                type: 'btn btn-green',
                onTap: function(e) {
                    $scope.meusveiculos.dados.splice(index, 1);
                    $localstorage.setObject("meusveiculos", $scope.meusveiculos);
                }
            }, {
                text: 'Não'
            }]);
        };
    });
