'use strict';
/**
 * @ngdoc function
 * @name Etransitocidadao.controller:contatoController
 * @description
 * # contatoController
 */
angular.module('Etransitocidadao')
    .controller('newsController', function($scope, tweets, config, $localstorage) {

        $scope.feed = $localstorage.getObject("newsetransitov2").tweets !== undefined ? $localstorage.getObject("newsetransitov2") : {
            tweets: []
        };

        $scope.load = function() {
            tweets.get({
                widgetId: config.tweet_id_blitzbelem
            }).success(function(data) {
                $scope.feed = data;
                /**/
                tweets.get({
                    widgetId: config.tweet_id_belemtransito
                }).success(function(data_) {
                    /**/
                    for (var i = 0; i < data_.tweets.length; i++) {
                        $scope.feed.tweets.push(data_.tweets[i]);
                    }
                    /**/
                    var result = _.sortBy($scope.feed.tweets, function(o) {
                        return new Date(o.time);
                    });
                    $scope.feed.tweets = result.reverse();
                    console.log($scope.feed.tweets);
                    try {
                        $localstorage.setObject("newsetransitov2", $scope.feed);
                    } catch (e) {}
                    try {
                        $scope.$broadcast('scroll.refreshComplete');
                    } catch (e) {}
                });
            });
        };

        $scope.msg_news = "As notícias são provenientes do twitter - @belemtransito e @belemtblitz. Caso você tenha alguma outra sugestão, por favor contate-nos em contato@huddle3.com";
        $scope.info_active_news = false;
        /**/
        /**/
        $scope.showinfonews = function() {
            $scope.info_active_news = true;
        };
    });
