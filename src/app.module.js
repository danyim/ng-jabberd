import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './app.routes'
import ChatController from './chat.controller';
import StropheService from './strophe.service';

import './style/base.css';
import './style/chat.css';
import './style/register.css';

angular
  .module('ngJabberd', [
    // Third party deps here
    uiRouter
  ])
  // .run(() => {

  // })
  .config(routes)
  .factory('stropheService', StropheService.stropheServiceFactory)
  .controller('chatController', ChatController)
