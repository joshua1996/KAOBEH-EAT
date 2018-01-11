var app = new Framework7({
    init: false,
    // App root element
    root: '#app',
    // App Name
    name: 'KaoBeh Eat',
    // App id
    id: 'com.indieDream.kaobeheat',
    // Enable swipe panel

    // Add default routes
    routes: [{
        path: '/',
        url: 'index.html',
    }, {
        path: '/home/',
        url: 'home.html',
    }, {
        path: '/place/',
        url: 'place.html',
    }, {
        path: '/map/',
        url: 'map.html',
    }],

});

var $$ = Dom7;

var mainView = app.views.create('.view-main', {});

$$(document).on('page:init', '.page[data-name="intro"]', function (e) {
    if (localStorage.getItem('skipIntro') === null) {

    } else {
        $$('.page[data-name="intro"]').remove();
        mainView.router.navigate('/home/');
        console.log('cabc');
    }
});

app.init();

$$(document).on('page:init', '.page[data-name="map"]', function (e) {
    var map = new GMaps({
        el: '#map',
        lat: -12.043333,
        lng: -77.028333
    });

    GMaps.geolocate({
        success: function (position) {
            map.setCenter(position.coords.latitude, position.coords.longitude);
        },
        error: function (error) {
            alert('Geolocation failed: ' + error.message);
        },
        not_supported: function () {
            alert("Your browser does not support geolocation");
        },
        always: function () {
        }
    });
});


$$(document).on('click', '#getStartBtn', function () {
    localStorage.setItem('skipIntro', true);
});

$$(document).on('page:afterout', '.page[data-name="intro"]', function (e) {
    $$('.page[data-name="intro"]').remove();
});


var swiper = app.swiper.create('.swiper-container', {
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
    },
});

// git remote add 5apps git@5apps.com:joshua1996_kaobeheat.git
// git push 5apps master