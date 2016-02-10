(function() {
    'use strict';
    angular.module('ngTweets', []).service('tweets', ["$http", function($http) {
        var service = this;
        this.get = function(config) {
            return $http({
                url: url(config.widgetId, config.lang),
                method: 'JSONP',
                transformResponse: appendTransform($http.defaults.transformResponse, function(value) {
                    return parse(value);
                })
            });
        };
        this.getTweets = function(config) {
            return service.get(config).then(trim);
        };
    }]);

    function trim(request) {
        return request.data.tweets;
    }

    function url(id, lang) {
        return ['http://cdn.syndication.twimg.com/widgets/timelines/', id, '?&lang=', (lang || 'en'), '&callback=JSON_CALLBACK', '&suppress_response_codes=true&rnd=', Math.random()].join('');
    }

    function appendTransform(defaults, transform) {
        defaults = angular.isArray(defaults) ? defaults : [defaults];
        return defaults.concat(transform);
    }

    function parse(data) {
        var response = {
                headers: data.headers,
                tweets: []
            },
            els, el, tweet, x, tmp, fullName_, nickName_, dtupdate_, favorites_;
        if (data.body) {
            els = angular.element(data.body)[0].getElementsByClassName('tweet');
            for (x = 0; x < els.length; x++) {
                el = els[x];
                tweet = {};
                tweet.retweet = (el.getElementsByClassName('retweet-credit').length > 0);
                tweet.header = el.getElementsByClassName('header').innerHTML;
                tweet.time = el.getElementsByClassName('u-url')[0].getAttribute('data-datetime');
                tweet.id = el.getAttribute('data-tweet-id');
                tmp = el.getElementsByClassName('e-entry-title')[0];
                tweet.html = tmp.innerHTML;
                tweet.text = tmp.textContent || tmp.innerText;
                fullName_ = el.getElementsByClassName('p-name')[0];
                nickName_ = el.getElementsByClassName('p-nickname')[0];
                dtupdate_ = el.getElementsByClassName('dt-updated')[0];
                tweet.time1 = dtupdate_.getAttribute('aria-label');
                tweet.time2 = dtupdate_.textContent || dtupdate_.innerText;
                try {
                    favorites_ = el.getElementsByClassName('stats-favorites')[0];
                    tweet.favorites = favorites_.textContent || favorites_.innerText;
                } catch (e) {}
                console.log();
                /*el.getElementsByClassName('u-photo')[0].getAttribute("data-src-1x")*/
                tweet.author = {
                    url: el.getElementsByClassName('u-url')[0].getAttribute('href'),
                    avatar: el.getElementsByClassName('u-photo')[0].getAttribute("data-src-2x"),
                    fullName: fullName_.textContent || fullName_.innerText,
                    nickName: nickName_.textContent || nickName_.innerText
                };
                tweet.updated = el.getElementsByClassName('dt-updated')[0].innerText;
                tweet.permalink = el.getElementsByClassName('permalink')[0].getAttribute('href');
                if (el.getElementsByClassName('inline-media')[0]) {
                    tweet.inlineMedia = el.getElementsByClassName('inline-media')[0].innerHtml;
                }
                response.tweets.push(tweet);
            }
        }
        return response;
    }
})();
