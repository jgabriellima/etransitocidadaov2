 'use strict';
 /**
  * @ngdoc function
  * @name Etransitocidadao.service:API
  * @description
  * # API
  */
 angular.module('Etransitocidadao').service('DB', function($ionicLoading, $location) {
     return {
         query: function(table, values) {

         },
         insert: function(table, id, values, callback) {
            callback("");             
         }
     };

 });
