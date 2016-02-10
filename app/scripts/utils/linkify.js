angular.module('Etransitocidadao').filter('linkify', function() {
    return function(input) {
        return ("" + input).linkify();
    };
});

if (!String.linkify) {
    String.prototype.linkify = function() {

        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

        return this
            .replace(urlPattern, '<a href="$&" title="link" target="_blank" onclick="window.open(\'$&\', \'_blank\', \'location=yes\');return false">$&</a>')
            .replace(pseudoUrlPattern, '$1<a href="http://$2" title="link" target="_blank" onclick="window.open(\'http://$2\', \'_blank\', \'location=yes\');return false;">$2</a>')
            .replace(emailAddressPattern, '<a href="mailto:$&" title="link" target="_blank" onclick="window.open(\'mailto:$&\', \'_blank\', \'location=yes\');return false;">$&</a>');
    };
}
