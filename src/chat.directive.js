import './style/app.css';

const ChatDirective = () => {
  return {
    template: require('./chat.html'),
    controller: 'chatController',
    controllerAs: 'vm'
  }
};

export default ChatDirective;
