var constants = new (function () {
    var ORIGIN = document.location.origin;
    var FOLDER = document.location.pathname.split('/')[1];
    var PATH = ORIGIN + "/" + FOLDER + "/web/";
    this.viewPath = function () {
        return document.location.origin + 'partials/';
    };
    this.webPath = function () {
        return PATH;
    };
})();


