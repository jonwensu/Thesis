'use strict';

(function () {
    angular.module('myApp.board.show', [
        'slickCarousel',
        'myApp.filter.trustHtml',
    ])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('board.show', {
                                url: "/show",
                                controller: "ShowBoardCtrl",
                                templateUrl: '/partials/board/show/show.html',
                            });
                }])
            .controller('ShowBoardCtrl', ["$scope", "$http", "$state", "$timeout", "Idle", 'timeAgo', '$filter', function ($scope, $http, $state, $timeout, Idle, timeAgo, $filter) {

                    $scope.clock = "..."; // initialise the time variable
                    $scope.tickInterval = 1000; //ms
                    $scope.slideInterval = 3000;
                    $scope.logo = "/pics/logo.png";
                    $scope.play = true;
                    $scope.webPath = window.location.origin + "/";
                    $scope.scrollTicker = false;
                    $scope.tickerDuration = null;
                    $scope.tickerRefreshDuration = null;

                    $scope.pinnedAnnouncements = [
                        {
                            pcontent: "Loading..."
                        },
                    ];

                    $scope.tickText = "Central Philippine University";
                    $scope.tickGreetings = getGreetings();


                    angular.element(document).ready(function () {
                        if (moment(moment().format('MM/DD'), 'MM/DD').holidayRange().holiday == "christmas") {
                            $("html").snowfall({flakeCount: 50, maxSpeed: 5, maxSize: 10, round: true});
                        }

                        toggleTickText();

                    });

                    var tour = new Tour({
                        steps: [
                            {
                                title: "Welcome!",
                                content: "Greetings! This is the <strong>CPU College of Engineering's Electronic Bulletin Board</strong>.  Let me show you around. <br /> (<i>Tap</i> <strong><i class='fa fa-chevron-right'></i></strong> <i>to start</i>)",
                                orphan: true,
                                duration: false
                            },
                            {
                                element: "#board-calendar",
                                title: "Calendar",
                                content: "This is the <strong>Calender</strong> which shows the current date.",
                            },
                            {
                                element: "#board-clock",
                                title: "Clock",
                                content: "This is the <strong>Clock</strong> showing you the current time.",
                            },
                            {
                                element: ".announcement-summary",
                                title: "Total Announcements",
                                content: "This is part shows the total number of announcements currently posted.",
                            },
                            {
                                element: "#board-search",
                                title: "Search Announcements",
                                content: "Tap on this <strong>Search</strong> button if you want to search for specific announcements.",
                                placement: "left",
                                duration: 8000
                            },
                            {
                                element: "#board-faculty",
                                title: "Faculty Search",
                                content: "Tapping on this <strong>Faculty</strong> button will allow you to search for faculty member profiles.",
                                placement: "left",
                                duration: 8000
                            },
                            {
                                element: "#board-map",
                                title: "Campus Map",
                                content: "The <strong>Campus Map</strong> will be shown once you tap on this <strong>Map</strong> button where you can look for buildings or landmarks within the campus that you wish to go to.",
                                placement: "left",
                                duration: 10000
                            },
                            {
                                element: ".board-announcement-nav",
                                title: "Navigation",
                                content: "You can navigate through the announcements here.  Tapping on an announcement will make it active.",
                                placement: "top",
                                duration: 15000,
                            },
                            {
                                element: ".board-announcements",
                                title: "Announcement",
                                content: "The current active announcement will be shown here.",
                                placement: "bottom",
                                duration: 15000,
                            },
                            {
                                element: ".expand",
                                title: "View Full Content",
                                content: "If you want to view the full content of the announcement just tap on the <a class='btn btn-default'><i class='fa fa-expand'></i></a> button.",
                                placement: "bottom",
                                duration: 15000,
                            },
                            {
                                element: "#play-toggle",
                                title: "Toggle Autoplay",
                                content: "By default, the current active announcement is changed every three seconds.  This is called <strong>autoplay</strong>.  If you want to pause/resume autoplay, just press this button.",
                                placement: "left",
                                duration: 20000,
                            },
                            {
                                element: "#refresh-announcements",
                                title: "Refresh Announcements",
                                content: "When idle for 30 seconds, the board refreshes the announcement list to check if there are any new announcements posted.  If you want to manually do this, just click this button.",
                                placement: "left",
                                duration: 20000,
                            },
                            {
                                element: "#board-tour",
                                title: "Board Tour",
                                content: "You probably already know what this button does since you already tapped on it.  If you ever feel like taking another tour around the board, just tap on this button.",
                                placement: "left",
                                duration: 20000,
                            },
                            {
                                title: "End of Tour",
                                content: "The tour ends here. I hope you now know how to use the board.",
                                orphan: true,
                                duration: 20000,
                            },
                        ],
                        backdrop: true,
                        duration: 5000,
                        template: function (i, step) {

                            return "<div class='popover tour'>" +
                                    "<div class='arrow'></div>" +
                                    "<h3 class='popover-title'></h3>" +
                                    "<div class='popover-content'></div>" +
                                    "<div class='popover-navigation'>" +
                                    "<div class='btn-group'>" +
                                    "<button class='btn btn-primary' data-role='prev'><i class='fa fa-chevron-left'></i></button>" +
                                    "<span data-role='separator'></span>" +
                                    "<button class='btn btn-info'data-role='pause-resume' data-pause-text='&#10074;&#10074;' data-resume-text='&#9658;'>&#10074;&#10074;</button>" +
                                    "<span data-role='separator'></span>" +
                                    "<button class='btn btn-primary' data-role='next'><i class='fa fa-chevron-right'></i></button>" +
                                    "</div>" +
                                    "<button class='btn btn-danger' data-role='end'><i class='fa fa-times'></i></button>" +
                                    "</div>" +
                                    "</div>"
                                    ;
                        },
                    });

                    $scope.startTour = function () {
                        tour.restart();
                    };

                    $('#spinner').show();

                    $scope.mapUrl = Routing.generate("map_view");

                    var colors = ["#f3f2cb", "#eddde1", "#acdafa", "#b9e2cd", "#ceb6fa"];
                    var count = 0;
                    $scope.shuffColors = shuffle(colors);
                    $scope.currentIndex = 0;

                    var oneDay = 60 * 60 * 24;
                    timeAgo.settings.fullDateAfterSeconds = oneDay;

                    var tick = function () {
                        $scope.clock = Date.now(); // get the current time
                        $timeout(tick, $scope.tickInterval); // reset the timer
                    };



                    function shuffle(o) {
                        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
                            ;
                        return o;
                    }

                    function assignColor() {
                        count++;
                        count = count > $scope.shuffColors.length - 1 ? 0 : count;
                    }

                    $scope.slickConfigFor = {
                        dots: false,
                        arrows: false,
                        fade: true,
                        cssEase: 'ease',
                        infinite: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        asNavFor: '.slide-nav',
                        method: {
                        },
                        event: {
                            afterChange: function (event, slick, currentSlide, nextSlide) {
                                $scope.slickConfigNav.method.slickGoTo(currentSlide);
                                $scope.currentIndex = currentSlide;
                                assignColor();
                                $('.slider-for').css('background', $('.slider-nav .slick-current').css('background-color'));
                            },
                            init: function (event, slick) {
                                slick.slickGoTo($scope.currentIndex);
                            }
                        },
                    };



                    $scope.slickConfigNav = {
                        dots: false,
                        arrows: true,
                        autoplay: true,
                        infinite: true,
                        autoplaySpeed: 5000,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        centerMode: true,
                        asNavFor: '.slide-for',
                        pauseOnHover: true,
                        focusOnSelect: true,
                        method: {
                        },
                        event: {
                            afterChange: function (event, slick, currentSlide, nextSlide) {
                                $scope.slickConfigFor.method.slickGoTo(currentSlide);
                                $scope.play = true;
                                updateAutoplay();
                            },
                            init: function (event, slick) {
                                slick.slickGoTo($scope.currentIndex);
                                var c = 0;
                                $('.slider-nav .slick-slide').each(function (i, r) {
                                    $(r).css('background-color', $scope.shuffColors[c]);
                                    c++;
                                    c = c > $scope.shuffColors.length - 1 ? 0 : c;
                                });
                                $('.slider-for').css('background', $('.slider-nav .slick-current').css('background-color'));
                            }
                        },
                    };
                    // Start the timer  
                    $timeout(tick, $scope.tickInterval);

                    $scope.togglePlay = function () {
                        $scope.play = !$scope.play;
                        updateAutoplay();
                    }

                    function updateAutoplay() {
                        if ($scope.play)
                        {
                            $scope.slickConfigNav.method.slickPlay();
                        } else {
                            $scope.slickConfigNav.method.slickPause();
                        }
                    }

                    $scope.loaded = false;
                    $http.get(Routing.generate('get_announcements_visible', {id: 1})).success(function (response) {
                        $scope.slides = response.announcements;
                        $scope.loaded = true;
                        $scope.scrollTicker = true;
                        tour.init();
                        refreshTicker();
                        $('.sl-show').mouseenter(function () {
                            $scope.slickConfigNav.method.slickPause();
                            $scope.play = false;
                        });
                        $('.sl-show').mouseleave(function () {
                            $scope.slickConfigNav.method.slickPlay();
                            $scope.play = true;
                        });
                        $('#spinner').fadeOut(500);
                    });

                    $scope.$on("IdleTimeout", function () {
                        $scope.updateSlides();
                        Idle.watch();
                    });
                    $scope.$on("IdleStart", function () {
                        $scope.play = true;
                        updateAutoplay();

                        if (!tour.ended()) {
                            tour.end();
                        }
                    });

                    $scope.updateSlides = function () {
                        $scope.loaded = false;
                        $('.slide-cont').fadeOut();
                        $('#spinner').fadeIn();
                        $http.get(Routing.generate('get_announcements_visible', {id: 1})).success(function (response) {
                            $scope.slides = response.announcements;
                            $scope.loaded = true;
                            var a = $filter('filter')($scope.slides, {visible: true, pinned: true});
                            a = extractPinnedContents(a);

                            if (!_.isEqual(a, extractPinnedContents($scope.pinnedAnnouncements))) {
                                $timeout(refreshTicker, 5000);
                            }
                            $('#spinner').fadeOut();
                            $('.slide-cont').fadeIn();
                        });

                    };

                    function refreshTicker() {
                        $('.ticker-2 .ticker-text').fadeOut(500, function () {
                            $scope.scrollTicker = false;
                            loadPinnedPosts();
                        });
                    }

                    function loadPinnedPosts() {

                        var a = $filter('filter')($scope.slides, {visible: true, pinned: true});
                        var result = [];
                        $scope.pinnedAnnouncements = [];
                        if (a.length > 0) {
                            var l = 0;
                            $.each(a, function (i, r) {
                                l += r.pcontent.length;
                            });
                            l *= 0.9;
                            l = l < 150 ? 150 : l;

                            $('.ticker-2').css('width', l + 'vw');



                            var currWidth = $('.ticker-2').css('width');

                            var d = currWidth.substring(0, currWidth.length - 2);

                            d *= 0.7;

                            $scope.tickerDuration = +d * 9;

                            result = a;


                        } else {
                            $scope.tickerDuration = 30000;
                            result = [
                                {
                                    pcontent: "Greetings! Welcome to the CPU College of Engineering\'s Electronic Bulletin Board."
                                },
                                {
                                    pcontent: "To take a tour around the board, click the \"?\" button."
                                },
                            ];
                        }

                        $('.ticker-2 .ticker-text').fadeIn(500, function () {
                            $scope.pinnedAnnouncements = result;
                            $scope.scrollTicker = true;
                        });

                    }

                    function extractPinnedContents(arr) {
                        var res = [];
                        $.each(arr, function (i, r) {
                            res.push({pcontent: r.pcontent});
                        });
                        return res;
                    }

                    function toggleTickText() {
                        var el = $('#greetings');
                        var g = el.html() == $scope.tickText ? $scope.tickGreetings : $scope.tickText;

                        el.fadeOut(500, function () {
                            el.html(g);
                            el.fadeIn(500);
                        });

                        $scope.tickGreetings = getGreetings();

                        $timeout(toggleTickText, 15000);
                    }

                    function getGreetings() {
                        var specialSeason = moment(moment().format('MM/DD'), 'MM/DD').holidayRange();
                        var holiday = moment(moment().format('MM/DD'), 'MM/DD').holiday();

                        var g = [];

                        if (specialSeason) {
                            g.push(specialSeason.greeting);
                        }

                        if (holiday != null) {
                            g.push(holiday.greeting);
                        }

                        var now = moment();

                        $.each(_greetings, function (i, r) {
                            var from = moment(r.from, 'HH:mm');
                            var to = moment(r.to, 'HH:mm');

                            var range = moment().range(from, to);
                            if (range.contains(now)) {
                                g.push(r.message);
                            }
                        });

                        if (g.length == 0) {
                            g.push("Hello There!");
                        }

                        return g[getRandomInt(0, g.length - 1)];
                    }

                    function getRandomInt(min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    }

                }]);



}());


