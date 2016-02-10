 'use strict';
/**
 * @ngdoc function
 * @name Etransitocidadao.service:API
 * @description
 * # API
 */
angular.module('Etransitocidadao').service('Alerts', function($ionicLoading, $ionicPopup, $http, $ionicHistory, $location) {

        return {
            default: function(scope_, title_, template_, btn, callback) {
                var myPopup = $ionicPopup.show({
                    template: template_,
                    title: title_,
                    scope: scope_,
                    buttons: [{
                        text: '<b>' + btn + '</b>',
                        type: 'btn btn-default',
                        onTap: function(e) {
                            callback();
                        }
                    }]
                });
            },
            confirm: function(scope_, title_, template_, buttons_) {
                $ionicPopup.show({
                    template: template_,
                    title: title_,
                    scope: scope_,
                    buttons: buttons_
                });
            }
        };

    });
