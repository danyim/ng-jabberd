import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';
import ngSanitize from 'angular-sanitize';
import angularModalService from 'angular-modal-service';
import routes from './app.routes'
import ChatController from './chat.controller';
import NewMessageController from './new-message.controller';
import RegisterController from './register.controller';
import StropheFactory from './strophe.factory';
import StropheService from './strophe.service';

import './style/base.css';
import './style/chat.css';
import './style/register.css';

angular
  .module('ngJabberd', [ uiRouter, ngCookies, ngSanitize, 'angularModalService' ])
  .run(() => {})
  .config(routes)
  .service('stropheService', StropheService)
  .service('strophe', StropheFactory)
  // .factory('stropheService', StropheService.stropheServiceFactory)
  .controller('chatController', ChatController)
  .controller('newMessageController', NewMessageController)
  .controller('registerController', RegisterController)
