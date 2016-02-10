'use strict';
/**
 * @ngdoc function
 * @name Etransitocidadao.controller:contatoController
 * @description
 * # contatoController
 */
angular.module('Etransitocidadao').controller('aboutController', function($scope, $ionicLoading, $cordovaSocialSharing) {

    $scope.share = function() {
        $ionicLoading.show({
            template: 'Compartilhando..!'
        });
        $cordovaSocialSharing
            .share("Baixe agora o aplicativo eTrânsito Cidadão", "eTrânsito Cidadão", "", "http://huddle3.com/etransitocidadao")
            .then(function(result) {
                $ionicLoading.hide();
                Alerts.default($scope, "Sucesso!", "Compartilhamento realizado com sucesso.", "Ok", function() {});
            }, function(err) {
                $ionicLoading.hide();
                Alerts.default($scope, "Ops!", "Compartilhamento não realizado.", "Ok", function() {});
            });

    };

});
