const routes = ($stateProvider, $urlRouterProvider, $locationProvider) => {
  $locationProvider.html5Mode(true).hashPrefix('!');

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('login', {
      url: '/',
      template: require('./register.html'),
      controller: 'registerController',
      controllerAs: 'vm'
    })
    .state('chat', {
      url: '/chat',
      template: require('./chat.html'),
      controller: 'chatController',
      controllerAs: 'vm'
    })
};

export default routes;
