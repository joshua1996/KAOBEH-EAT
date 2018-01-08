var app = new Framework7({
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
    }],
    // ... other parameters
});

var $$ = Dom7;

var mainView = app.views.create('.view-main', {
    url: '/'
});

var swiper = app.swiper.create('.swiper-container', {
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
    },
    on: {
        progress: function (){
           console.log('gerg');
        }
    }
});