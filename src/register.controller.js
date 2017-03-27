const LOGIN_SETTINGS_KEY = 'ngjabberd_login';

class RegisterController {
  constructor($scope, $state, $q, $cookies, stropheService) {
    this.stropheService = stropheService;
    this.$scope = $scope;
    this.$state = $state;
    this.$q = $q;
    this.$cookies = $cookies;

    this.hostname = '';
    this.username = '';
    this.password = '';
    this.error = '';
    this.remember = false;

    this.activate();
  }

  activate() {
    this.loadCookies();
  }

  login() {
    this.error = '';
    this.status = '';

    const connect = this.stropheService.connect(this.username, this.password, this.hostname);
    connect.promise
      .then(
        (val) => {
          this.saveCookiesIfRemembered();
          this.$state.go('chat');
        },
        (reason) => {
          this.error = reason;
        }
      );
  }

  register() {
    this.error = '';
    this.status = '';

    const connect = this.stropheService.registerConnect(this.username, this.password, this.hostname);
    connect.promise
      .then(
        (val) => {
          this.saveCookiesIfRemembered();
          this.$state.go('chat');
        },
        (reason) => {
          this.error = reason;
        }
      );
  }

  loadCookies() {
    const cookie = this.$cookies.get(LOGIN_SETTINGS_KEY);
    if(cookie) {
      const cookieJSON = JSON.parse(cookie);
      this.hostname = cookieJSON.hostname;
      this.username = cookieJSON.username;
      this.remember = true;
    }
  }

  saveCookiesIfRemembered() {
    if(this.remember) {
      this.$cookies.putObject(LOGIN_SETTINGS_KEY, {
        hostname: this.hostname,
        username: this.username
      });
    }
    else {
      this.clearCookies();
    }
  }

  clearCookies() {
    this.$cookies.remove(LOGIN_SETTINGS_KEY);
  }

  sendMessage() {
    this.stropheService.sendMessage(this.message, this.recipient);
    this.recvMessage(this.message, this.user); // Show the message we just sent
    this.message = '';
  }

  recvMessage(message, author) {
    this.messages.push({message, author});
  }
}

export default RegisterController;
