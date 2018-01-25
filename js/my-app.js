//phone must enable wifi to access google map locate!!!

Template7.global = {
    url: 'http://localhost/kaobeh-eat-db/'
};
//http://kaobeheat.bojioong.xyz/
//http://localhost/kaobeh-eat-db/
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
        path: '/food/:restaurant/:index',
        url: './food.html',
    }, {
        path: '/foodBuy/:foodID/:category/:index',
        url: 'food_buy.html',
    }],
});
var $$ = Dom7;
var mainView = app.views.create('.view-main', {});
$$(document).on('page:init', '.page[data-name="intro"]', function (e) {
    if (localStorage.getItem('skipIntro') === null) {} else {
        $$('.page[data-name="intro"]').remove();
        mainView.router.navigate('/home/');
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
 * home
 */
var db;
$$(document).on('page:init', '.page[data-name="home"]', function (e) {
    console.log('aa');

    const customerData = [{
            foodID: "444-44-4444",
            name: "Bill",
            age: 35,
            email: "bill@company.com"
        },
        {
            foodID: "555-55-5555",
            name: "Donna",
            age: 32,
            email: "donna@home.org"
        }
    ];
    const dbName = "KaoBehEat";

    var request = indexedDB.open(dbName, 1);

    request.onsuccess = function (event) {
        db = this.result;
    };
    request.onerror = function (event) {
        // 错误处理程序在这里。
    };
    request.onupgradeneeded = function (event) {
        // 创建一个对象存储空间来持有有关我们客户的信息。
        // 我们将使用 "ssn" 作为我们的 key path 因为它保证是唯一的。
        var objectStore = event.currentTarget.result.createObjectStore("cart", {
            keyPath: "foodID"
        });
    };




});


/**
 * map.html
 */

var circle;
var map;
$$(document).on('page:init', '.page[data-name="map"]', function (e) {
    console.log(db);
    var transaction = db.transaction(["cart"], "readwrite");
    var objectStore = transaction.objectStore("cart");
    var request = objectStore.add({ foodID:'abc' });
    map = new GMaps({
        el: '#map',
        lat: -12.043333,
        lng: -77.028333

    });
    GMaps.geolocate({
        enableHighAccuracy: false,
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
    app.request.json(Template7.global.url + 'restaurant.php', data, function (data) {
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
            if (map.checkGeofence(v.restaurant_lat, v.restaurant_lng, circle)) {
                location.push(v);
            }
        });
        if (location.length > 0) {
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
    app.request.json(Template7.global.url + 'restaurant.php', data, function (data) {
        var obj = {
            'restaurant': data
        };
        var template = $$('#template').html();
        var compiledTemplate = Template7.compile(template);
        var html = compiledTemplate(obj);
        $$('.page[data-name="restaurant"] .page-content').html(html);
        Template7.global.restaurant = data;
    });

});

/**
 * food.html
 */
$$(document).on('page:init', '.page[data-name="food"]', function (e) {
    $('.foodTitle').text(Template7.global.restaurant[e.detail.route.params.index].restaurant_name);
    var data = {
        action: 'findFoodByRestaurant',
        restaurantID: e.detail.route.params.restaurant
    };
    app.request.json(Template7.global.url + 'restaurant.php', data, function (data) {
        var groupedData = _.groupBy(data, 'food_category');
        var obj = {
            'restaurant': data,
            'index': groupedData
        };
        console.log(obj);
        Template7.global.foodlist = groupedData;
        var template = $$('#template_category').html();
        var compiledTemplate = Template7.compile(template);
        var html = compiledTemplate(obj);
        $$('.page[data-name="food"] .page-content').html(html);
    });
});
//{{ food_name }} @key
/**
 * food_buy.html
 */
$$(document).on('page:init', '.page[data-name="foodBuy"]', function (e) {
    $('.price').text('RM ' + (parseFloat(Template7.global.foodlist[e.detail.route.params.category][e.detail.route.params.index].food_price)).toFixed(2));
    $('.foodImg').css('background-image', 'url(' + Template7.global.url + 'img/food/' + Template7.global.foodlist[e.detail.route.params.category][e.detail.route.params.index].food_img + ')');
    $('.foodBuyTitle').text(Template7.global.foodlist[e.detail.route.params.category][e.detail.route.params.index].food_name);
    var pickerDevice = app.picker.create({
        inputEl: '#demo-picker-device',
        cols: [{
            textAlign: 'center',
            values: (function () {
                var arr = [];
                for (var i = 1; i <= 59; i++) {
                    arr.push(i);
                }
                return arr;
            })(),
        }]
    });

    pickerDevice.on('close', function (picker, values, displayValues) {
        console.log(picker.getValue() * Template7.global.foodlist[e.detail.route.params.category][e.detail.route.params.index].food_price);
        $('.price').text('RM ' + (picker.getValue() * Template7.global.foodlist[e.detail.route.params.category][e.detail.route.params.index].food_price).toFixed(2));
    });

    var data = {
        action: 'foodDetail',
        foodID: e.detail.route.params.foodID
    };

});

$$(document).on('click', '.addToCart', function () {


});



// git remote add 5apps git@5apps.com:joshua1996_kaobeheat.git
// git push 5apps master