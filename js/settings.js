// Global Settings.
settings = {
  get version() {
    return localStorage['version'];
  },
  set version(val) {
    localStorage['version'] = val;
  },
  get currentPosition() {
    var key = localStorage['currentPosition'];
    return (typeof key == 'undefined') ? null : key;
  },
  set currentPosition(val) {
    localStorage['currentPosition'] = val;
  },
  get timeformat() {
    var key = localStorage['timeformat'];
    return (typeof key == 'undefined') ? '24h' : key;
  },
  set timeformat(val) {
    localStorage['timeformat'] = val;
  },
  get calculation() {
    var key = localStorage['calculation'];
    return (typeof key == 'undefined') ? 'Jafari' : key;
  },
  set calculation(val) {
    localStorage['calculation'] = val;
  },
  get timenames() {
    var key = localStorage['timenames'];
    return (typeof key == 'undefined') ?
        ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] : key.split(',');
  },
  set timenames(val) {
    localStorage['timenames'] = val;
  },
  get notificationVisible() {
    var key = localStorage['notificationVisible'];
    return (typeof key == 'undefined') ? true : key === 'true';
  },
  set notificationVisible(val) {
    localStorage['notificationVisible'] = val;
  },
  get badgeVisible() {
    var key = localStorage['badgeVisible'];
    return (typeof key == 'undefined') ? true : key === 'true';
  },
  set badgeVisible(val) {
    localStorage['badgeVisible'] = val;
  },
  get opt_out() {
    var key = localStorage['opt_out'];
    return (typeof key == 'undefined') ? false : key === 'true';
  },
  set opt_out(val) {
    localStorage['opt_out'] = val;
  },
};
