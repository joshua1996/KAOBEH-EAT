var app = new Framework7({
    init: false,
    // App root element
    root: '#app',
    // App Name
    name: 'KaoBeh Eat',
    // App id
    id: 'com.indieDream.kaobeheat',
    precompileTemplates: false,
    // Unabled pages rendering using Template7
    template7Pages: false,
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
    }, {
        path: '/restaurant/',
        url: 'restaurant.html',
    }, {
        path: '/food/:restaurant',
        templateUrl: './food.html',
    }],
});
var $$ = Dom7;
var mainView = app.views.create('.view-main', {});
$$(document).on('page:init', '.page[data-name="intro"]', function (e) {
    if (localStorage.getItem('skipIntro') === null) {} else {
        $$('.page[data-name="intro"]').remove();
        mainView.router.navigate('/home/');
        console.log('fgf');
    }
});
app.init();

var swiper = app.swiper.create('.swiper-container', {
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
    },
});

/**
 * map.html
 */

var circle;
var map;
$$(document).on('page:init', '.page[data-name="map"]', function (e) {
    map = new GMaps({
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
        always: function () {}
    });
});

$$(document).on('click', '#getStartBtn', function () {
    localStorage.setItem('skipIntro', true);
});
$$(document).on('page:afterout', '.page[data-name="intro"]', function (e) {
    $$('.page[data-name="intro"]').remove();
});

$$(document).on('click', '.mapfindrestaurent', function () {
    circle = map.drawCircle({
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
        radius: 1000,
        fillColor: 'yellow',
        fillOpacity: 0.5,
        strokeWeight: 0
    });
    var data = {
        action: 'restaurantWithinRadius',
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng()
    };
    app.request.json('http://localhost/kaobeh-eat-db/restaurant.php', data, function (data) {
        var markers_data = [];
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item.lat != undefined && item.lng != undefined) {
                var icon = 'https://foursquare.com/img/categories/food/default.png';

                markers_data.push({
                    lat: item.lat,
                    lng: item.lng,
                    title: item.restaurantID,
                    icon: {
                        size: new google.maps.Size(32, 32),
                        url: icon
                    }
                });
            }
        }
        map.addMarkers(markers_data);

        var location = [];
        $.each(data, function (i, v) {
            if (map.checkGeofence(v.lat, v.lng, circle)) {
                location.push(v);
            }
        });
        if (location.length > 0) {
            // localStorage.setItem('availableLocation', JSON.stringify(location));
            mainView.router.navigate('/restaurant/');
        } else {
            app.dialog.alert('附近没有餐厅！');
        }
    });
});

/**
 * restaurant.html
 */
$$(document).on('page:init', '.page[data-name="restaurant"]', function () {
    var data = {
        action: 'restaurantWithinRadius',
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng()
    };
    app.request.json('http://localhost/kaobeh-eat-db/restaurant.php', data, function (data) {
        console.log('gg');
        var obj = {
            'restaurant': data
        };
        var template = $$('#template').html();
        var compiledTemplate = Template7.compile(template);
        var html = compiledTemplate(obj);
        $$('.page[data-name="restaurant"] .page-content').html(html);
    });
});

/**
 * food.html
 */
$$(document).on('page:init', '.page[data-name="food"]', function (e) {
    console.log(e.detail.route.params.restaurant);
    var data = {
        action: 'restaurantWithinRadius',
        restaurantID: map.getCenter().lat()
    };
    app.request.json('http://localhost/kaobeh-eat-db/restaurant.php', data, function (data) {

        var obj = {
            'restaurant': data
        };
        var template = $$('#template').html();
        var compiledTemplate = Template7.compile(template);
        var html = compiledTemplate(obj);
        $$('.page[data-name="restaurant"] .page-content').html(html);
    });
   
});

// git remote add 5apps git@5apps.com:joshua1996_kaobeheat.git
// git push 5apps master