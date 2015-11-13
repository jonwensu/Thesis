
var constants = new (function () {
    var ORIGIN = document.location.origin;
    var FOLDER = document.location.pathname.split('/')[1];
    var PATH = ORIGIN + "/" + FOLDER + "/web/";
    this.viewPath = function () {
        return PATH + 'partials/';
    };
    this.webPath = function () {
        return PATH;
    };
})();


$(document).ready(function () {
    $('.btn-setting').click(function (e) {
        e.preventDefault();
        $('#myModal').modal('show');
    });
    $('#spinner').fadeOut(100);
    $('[data-toggle="tooltip"]').tooltip();

    $('.accordion > a').click(function (e) {
        e.preventDefault();
        var $ul = $(this).siblings('ul');
        var $li = $(this).parent();
        var arrow = $('span.accordion-arrow', this);
        if ($ul.is(':visible')) {
            $li.removeClass('active');
            arrow.html("<i class='fa fa-chevron-right'></i>");
        }
        else {
            $li.addClass('active');
            arrow.html("<i class='fa fa-chevron-down'></i>");
        }
        $ul.slideToggle();
    });

    $('.accordion li.active:first').parents('ul').slideDown();
});