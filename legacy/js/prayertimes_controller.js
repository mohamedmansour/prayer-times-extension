/**
 * Main Application Controller.
 * @constructor
 */
PrayerTimesController = function() {
  this.entity = new GeoPrayerTimes();
  this.alarm = new AlarmClock(this.entity);
};

/**
 * Initialization routine.
 */ 
PrayerTimesController.prototype.init = function() {
  this.initializeGeolocation();
  this.initializeExtensionDefaults();
  this.initializeVersion();
};


/**
 * Initialize Geolocation to see where you really are.
 */
PrayerTimesController.prototype.initializeGeolocation = function() {
  // Get the current geo location coordinates if none exist.
  if (settings.currentPosition == null) {
    this.entity.getGeolocation(function(latitude, longitude) {
      settings.currentPosition = latitude + ',' + longitude;
    });
  }
  else {
    var position = settings.currentPosition;
    var index = position.indexOf(',');
    var lat = parseFloat(position.substring(0, index));
    var lng = parseFloat(position.substring(index + 1, position.length));
    this.entity.setLatitude(lat);
    this.entity.setLongitude(lng);
    this.entity.setLoaded(true);
  }
};

/**
 * Load initial extension defaults.
 */
PrayerTimesController.prototype.initializeExtensionDefaults = function() {
  // Load defaults. Badge Color default.
  chrome.browserAction.setBadgeBackgroundColor({ color: [162, 150, 168, 255]});
  
  // Set the Praytime defaults.
  this.entity.getPrayTime().setMethod(settings.calculation);
  this.entity.setTimeFormat(settings.timeformat);
  
  // Setup the Athan type.
  this.alarm.setAthan(settings.athan);
  
  // Start the Alarm Clock count down.
  this.alarm.start();
};

/**
 * Check if the version has changed. In case we want to do something in the
 * future.
 */
PrayerTimesController.prototype.initializeVersion = function() {
  var currVersion = chrome.app.getDetails().version;
  var prevVersion = settings.version
  if (currVersion != prevVersion) {
    // Check if we just installed this extension.
    if (typeof prevVersion == 'undefined') {
      this.onInstall();
    } 
    else {
      this.onUpdate();
    }
    // Update the version incase we want to do something in future.
    settings.version = currVersion;
  }
};

/**
 * When the extension first installed. Lets bring up the options page so they
 * could start setting it up!
 */
PrayerTimesController.prototype.onInstall = function() {
  this.openSingletonPage('options.html?install');
};

/**
 * Hook for updates.
 */
PrayerTimesController.prototype.onUpdate = function() {
  // Do not send updates if the user is opt'd out!
  if (!settings.opt_out) {
    // chrome.tabs.create({url: 'updates.html'});
  }
};

/**
 * Open a singleton page, which means, if a page already exists, it just selects it.
 * @param url The page which it will navigate to.
 */
PrayerTimesController.prototype.openSingletonPage = function(url) {
  var views = chrome.extension.getViews();
  for (var v in views) {
    var view = views[v];
    if (view.location.href.indexOf(url) == 0) {
      view.focus();
      return;
    }
  }
  chrome.tabs.create({url: url, selected: true});
};

/**
 * Get the main prayer time entity.
 */
PrayerTimesController.prototype.getPrayerEntity = function() {
  return this.entity;
};
