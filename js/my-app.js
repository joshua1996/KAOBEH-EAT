var app = new Framework7({
    init: false,
    // App root element
    root: '#app',
    // App Name
    name: 'KaoBeh Eat',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },
    // Add default routes
    routes: [{
        path: '/home/',
        url: 'home.html',
    }, {
        path: '/',
        url: 'index.html',
    }],

});

var $$ = Dom7;

var mainView = app.views.create('.view-main', {
});

$$(document).on('page:init', '.page[data-name="intro"]', function (e) {
    if (localStorage.getItem('skipIntro') === null) {

    } else {
        $$('.page[data-name="intro"]').remove();
         mainView.router.navigate('/home/');
    }
});

app.init();

$$(document).on('click', '#getStartBtn', function() {
    localStorage.setItem('skipIntro', true);
    
});

$$(document).on('page:afterout', '.page[data-name="intro"]', function (e) {
    $$('.page[data-name="intro"]').remove();
});

$$(document).on('page:init', '.page[data-name="home"]', function (e) {
});


var swiper = app.swiper.create('.swiper-container', {
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
    },
});