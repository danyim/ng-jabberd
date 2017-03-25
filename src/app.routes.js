const routes = ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('register', {
      url: '/',
      template: require('./chat.html'),
      controller: 'chatController',
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
