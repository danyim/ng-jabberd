import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './app.routes'
import ChatController from './chat.controller';
import RegisterController from './register.controller';
import StropheService from './strophe.service';

import './style/base.css';
import './style/chat.css';
import './style/register.css';

angular
  .module('ngJabberd', [uiRouter])
  .run(() => {})
  .config(routes)
  .factory('stropheService', StropheService.stropheServiceFactory)
  .controller('chatController', ChatController)
  .controller('registerController', RegisterController)
